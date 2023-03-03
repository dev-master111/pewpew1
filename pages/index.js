import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Divider, TextArea, Form,  Button, Icon, Loader, Dimmer } from 'semantic-ui-react'
import { ToastContainer, toast } from 'react-toastify'
import ReactDiffViewer from 'react-diff-viewer'

import RangeItem from '@/components/RangeItem'
import SavePromptModal from '@/components/SavePromptModal'
import HistoryList from '@/components/HistoryList'
import getHisotry from '@/utils/api/getHistory'
import getModels from '@/utils/api/getModels'
import getPrompts from '@/utils/api/getPrompts'
import submitCompletion from '@/utils/api/submitCompletion'
import 'react-toastify/dist/ReactToastify.css'

export default function Home() {
  const [temperature, setTemperature] = useState(0.7)
  const [maxLen, setMaxLen] = useState(2048)
  const [topP, setTopP] = useState(1)
  const [freqency, setFrequency] = useState(0)
  const [presence, setPresence] = useState(0)
  const [bestOf, setBestOf] = useState(2)
  const [promptOptions, setPromptOptions] = useState([])
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [modelOptions, setModelOptions] = useState([
    {
      key: 'text-davinci-003',
      text: 'text-davinci-003',
      value: 'text-davinci-003',
    }
  ])
  const [selectedModel, setSelectedModel] = useState('text-davinci-003')
  const [openHistory, setOpenHistory] = useState(false)
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null)
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [historyList, setHistoryList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    setLoading(true)

    try {
      await getPromptsData()
      const modelsData = await getModels()

      setModelOptions(modelsData.data.map(modelData => ({
        key: modelData.id,
        text: modelData.id,
        value: modelData.id
      })))

      setLoading(false)
    } catch (error) {
      console.error('Failed to get models:')
      console.error(error)
      setLoading(false)
      toast.error(`Failed to get models: ${error.message}`)
    }
  }

  const getHistoryData = async () => {
    try {
      const historyData = await getHisotry(selectedPrompt)

      if (historyData && Array.isArray(historyData)) {
        setHistoryList(historyData)
      }
    } catch (error) {
      console.error('Failed to get history:')
      console.error(error)
      toast.error(`Failed to get history: ${error.message}`)
    }
  }

  const getPromptsData = async () => {
    try {
      const promptsData = await getPrompts()

      if (promptsData && Array.isArray(promptsData)) {
        setPromptOptions(promptsData)

        if (promptsData.length > 0) {
          const oldPrompt = sessionStorage.getItem('currentPrompt')

          if (!oldPrompt) {
            setSelectedPrompt(promptsData[0]._id)
            sessionStorage.setItem('currentPrompt', promptsData[0]._id)
          } else {
            setSelectedPrompt(oldPrompt)

            const promptDetails = promptsData.find(prompt => prompt._id === oldPrompt)

            if (promptDetails) {
              setInputText(promptDetails.text || '')
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to get prompts:')
      console.error(error)
      toast.error(`Failed to get prompts: ${error.message}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedPrompt || !selectedModel) {
      toast.error('Please select Prompt and Model.')
      return
    }

    if (!inputText) {
      toast.error("Input text shouldn't be null.")
      return
    }

    try {
      setLoading(true)

      const completionData = await submitCompletion({
        text: inputText,
        prompt: selectedPrompt,
        options: {
          temperature: parseFloat(temperature),
          maxTokens: parseInt(maxLen),
          topP: parseFloat(topP),
          frequencyPenalty: parseFloat(freqency),
          presencePenalty: parseFloat(presence),
          bestOf: parseFloat(bestOf)
        }
      })
      if (completionData.choices && completionData.choices.length > 0){
        setOutputText(completionData.choices[0].text)
      } else {
        setOutputText('')
      }

      await getHistoryData()
      setLoading(false)
    } catch (error) {
      toast.error(`Failed to get completion: ${error.message}`)
      setOutputText('')
      setLoading(false)
    }
  }

  const onAddPrompt = (data) => {
    setPromptOptions(data)
  }

  const onOpenHistory = async () => {
    if (!selectedPrompt) {
      toast.error('Please select Prompt.')
      return
    }

    setLoading(true)
    setOpenHistory(true)
    await getHistoryData()
    setLoading(false)
  }

  const onChangePrompt = value => {
    setSelectedPrompt(value.value)
    sessionStorage.setItem('currentPrompt', value.value)
    setHistoryList([])
    setSelectedHistoryItem(null)
    setOpenHistory(false)
    setOutputText('')

    const promptDetails = promptOptions.find(prompt => prompt._id === value.value)

    if (promptDetails) {
      setInputText(promptDetails.text || '')
    }
  }

  const getPreHistory = () => {
    if (selectedHistoryItem) {
      const selectedHistoryIndex = historyList.findIndex(hisData => hisData._id === selectedHistoryItem._id)

      if (selectedHistoryIndex < historyList.length - 1) {
        return historyList[selectedHistoryIndex + 1]
      }

      return {}
    }

    return {}
  }

  const lastHistory = getPreHistory()

  return (
    <>
      <Head>
        <title>OpenAI Simulator</title>
      </Head>
      <main className="main-wrapper">
        <div className="page-header">
        </div>
        <Divider />
        <div className="page-content">
          <ToastContainer
            position="top-center"
            closeOnClick
            hideProgressBar={true}
          />

          <div className="page-content-header">
            <div className="title">Playground</div>
            <div className="actions">
              <Form.Select
                name='prompt'
                onChange={(e, value) => onChangePrompt(value)}
                options={promptOptions.map(prompt => ({
                  key: prompt._id,
                  value: prompt._id,
                  text: prompt.name
                }))}
                value={selectedPrompt}
              />
              <SavePromptModal
                onSubmit={onAddPrompt}
                text={inputText}
                prompts={promptOptions}
                current={selectedPrompt}
              />
            </div>
          </div>
          <Divider />
          <div className="page-content-wrapper">
            {openHistory && (
              <div className="history-sidebar">
                <HistoryList
                  onClose={() => {
                    setOpenHistory(false)
                    setSelectedHistoryItem(null)
                  }}
                  onChange={value => setSelectedHistoryItem(value)}
                  value={selectedHistoryItem}
                  listData={historyList}
                />
              </div>
            )}

            <Form onSubmit={handleSubmit} className="playground-container">
              {!selectedHistoryItem && (
                <div className="playground-panels">
                  <div className="playground-panel">
                    <div className="input-wrapper">
                      <div className="input-label">Input</div>
                      <TextArea
                        onChange={e => setInputText(e.target.value)}
                        placeholder="Input..."
                        value={inputText}
                        onKeyDown={e => {
                          if (e.ctrlKey && e.key === 'Enter') {
                            handleSubmit(e)
                          }
                        }}
                      />
                    </div>
                    <div className="input-wrapper">
                      <div className="input-label">Output</div>
                      <TextArea
                        disabled
                        placeholder="Output..."
                        value={outputText}
                      />
                    </div>
                  </div>
                </div>
              )}
              {selectedHistoryItem && (
                <div className="diff-panels">
                  <div className="diff-panel">
                    <ReactDiffViewer
                      oldValue={lastHistory.input_text || ''}
                      newValue={selectedHistoryItem.input_text}
                      splitView={true}
                      leftTitle="Old Input"
                      rightTitle="Input"
                      extraLinesSurroundingDiff={20}
                      showDiffOnly={false}
                    />
                  </div>
                  <div className="diff-panel">
                    <ReactDiffViewer
                      oldValue={lastHistory.output_text || ''}
                      newValue={selectedHistoryItem.output_text}
                      splitView={true}
                      leftTitle="Old Output"
                      rightTitle="Output"
                      extraLinesSurroundingDiff={20}
                      showDiffOnly={false}
                    />
                  </div>
                </div>
              )}
              {!selectedHistoryItem && (
                <div className="actions">
                  <Button
                    type="submit"
                    color="green"
                    disabled={!inputText}
                    title={"Input text shouldn't be null."}
                  >
                    Submit
                  </Button>
                  <Icon name="history" onClick={onOpenHistory} />
                </div>
              )}
            </Form>

            <div className="settings-sidebar">
              <Form>
                <Form.Select
                  label="Model"
                  name="prompt"
                  onChange={(e, value) => {
                    setSelectedModel(value.value)
                    setOutputText('')
                  }}
                  options={modelOptions}
                  value={selectedModel}
                />
              </Form>
              <RangeItem
                label="Temperature"
                value={temperature}
                max={1}
                min={0}
                step={0.01}
                onChange={e => setTemperature(e.target.value)}
              />
              <RangeItem
                label="Maximum length"
                value={maxLen}
                max={4000}
                min={0}
                step={1}
                onChange={e => setMaxLen(e.target.value)}
              />
              <RangeItem
                label="Top P"
                value={topP}
                max={1}
                min={0}
                step={0.01}
                onChange={e => setTopP(e.target.value)}
              />
              <RangeItem
                label="Frequency penalty"
                value={freqency}
                max={2}
                min={0}
                step={0.01}
                onChange={e => setFrequency(e.target.value)}
              />
              <RangeItem
                label="Presence penalty"
                value={presence}
                max={2}
                min={0}
                step={0.01}
                onChange={e => setPresence(e.target.value)}
              />
              <RangeItem
                label="Best of"
                value={bestOf}
                max={3}
                min={1}
                step={1}
                onChange={e => setBestOf(e.target.value)}
              />
            </div>
          </div>

          {loading && (
            <div className="page-loader">
              <Dimmer active>
                <Loader size="large" />
              </Dimmer>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
