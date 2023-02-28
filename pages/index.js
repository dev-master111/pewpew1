import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Divider, TextArea, Form,  Button, Icon, Loader, Dimmer } from 'semantic-ui-react'
import RangeItem from '@/components/RangeItem'
import SavePromptModal from '@/components/SavePromptModal'
import HistoryList from '@/components/HistoryList'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

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
  const [selectedModel, setSelectedModel] = useState(null)
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
      await getPropmpts()

      const response = await fetch('/api/models')
      const responseData = await response.json()

      setModelOptions(responseData.data.map(modelData => ({
        key: modelData.id,
        text: modelData.id,
        value: modelData.id
      })))

      setLoading(false)
    } catch (error) {
      console.error('Failed to get models')
      console.error(error)
      setLoading(false)
    }
  }

  const getHistoryData = async () => {
    try {
      const historyRes = await fetch(`/api/history?prompt=${selectedPrompt}`)
      const historyData = await historyRes.json()

      if (historyData && Array.isArray(historyData)) {
        setHistoryList(historyData)
      }
    } catch (error) {
      console.error('Failed to get models')
      console.error(error)
    }
  }

  const getPropmpts = async () => {
    try {
      const promptsRes = await fetch('/api/prompts')
      const promptsData = await promptsRes.json()

      if (promptsData && Array.isArray(promptsData)) {
        setPromptOptions(promptsData.map(prompt => ({
          key: prompt._id,
          text: prompt.name,
          value: prompt._id
        })))

        if (promptsData.length > 0) {
          setSelectedPrompt(promptsData[0]._id)
        }
      }
    } catch (error) {
      console.error('Failed to get models')
      console.error(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedPrompt || !selectedModel) {
      toast.error('Please select Prompt and Model.')
      return;
    }

    if (!inputText) {
      toast.error("Input text shouldn't be null.")
      return;
    }

    try {
      setLoading(true)
      const response = await fetch('/api/completions', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: inputText,
          prompt: selectedPrompt,
          options: {
            temperature,
            maxTokens: maxLen,
            topP: topP,
            frequencyPenalty: freqency,
            presencePenalty: presence
          }
        })
      })

      const responseData = await response.json()
      if (responseData.choices && responseData.choices.length > 0){
        setOutputText(responseData.choices[0].text)
      } else {
        setOutputText('')
      }

      await getHistoryData()
      setLoading(false)
    } catch (error) {
      setOutputText('')
      setLoading(false)
    }
  }

  const onAddPrompt = (data) => {
    setPromptOptions(data.map(prompt => ({
      key: prompt._id,
      text: prompt.name,
      value: prompt.name
    })))
  }

  const onOpenHistory = async () => {
    if (!selectedPrompt) {
      toast.error('Please select Prompt.')
      return;
    }

    setLoading(true)
    setOpenHistory(true)
    await getHistoryData()
    setLoading(false)
  }

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
                onChange={(e, value) => {
                  setSelectedPrompt(value.value)
                  setHistoryList([])
                  setSelectedHistoryItem(null)
                  setOpenHistory(false)
                }}
                options={promptOptions}
                value={selectedPrompt}
              />
              <SavePromptModal onSubmit={onAddPrompt} />
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
              <div className="playground-panels">
                <div className="playground-panel">
                  <div className="input-wrapper">
                    <div className="input-label">Input</div>
                    <TextArea
                      onChange={e => setInputText(e.target.value)}
                      placeholder="Input..."
                      value={inputText}
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

                {selectedHistoryItem && (
                  <div className="playground-panel">
                    <div className="input-wrapper">
                      <div className="input-label">Old Input</div>
                      <TextArea
                        disabled
                        placeholder="Input..."
                        value={selectedHistoryItem.input_text}
                      />
                    </div>
                    <div className="input-wrapper">
                      <div className="input-label">Old Output</div>
                      <TextArea
                        disabled
                        placeholder="Output..."
                        value={selectedHistoryItem.output_text}
                      />
                    </div>
                  </div>
                )}
              </div>
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
            </Form>

            <div className="settings-sidebar">
              <Form>
                <Form.Select
                  label="Model"
                  name="prompt"
                  onChange={(e, value) => {
                    setSelectedModel(value.value)
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
                max={20}
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
