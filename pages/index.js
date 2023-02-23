import Head from 'next/head'
import { useState } from 'react'
import { Divider, TextArea, Form,  Button, Icon, Dropdown } from 'semantic-ui-react'
import RangeItem from '@/components/RangeItem'
import SavePromptModal from '@/components/SavePromptModal'
import HistoryList from '@/components/HistoryList'

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
          <div className="page-content-header">
            <div className="title">Playground</div>
            <div className="actions">
              <Form.Select
                name='prompt'
                onChange={(e, value) => {
                  setSelectedPrompt(value.value)
                }}
                options={promptOptions}
                value={selectedPrompt}
              />
              <SavePromptModal />
              <Dropdown text={null} button icon="ellipsis horizontal">
                <Dropdown.Menu>
                  <Dropdown.Item text='New' />
                </Dropdown.Menu>
              </Dropdown>
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
                />
              </div>
            )}

            <Form className="playground-container">
              <div className="playground-panels">
                <div className="playground-panel">
                  <div className="input-wrapper">
                    <div className="input-label">Input</div>
                    <TextArea placeholder="Input..." />
                  </div>
                  <div className="input-wrapper">
                    <div className="input-label">Output</div>
                    <TextArea disabled placeholder="Output..." />
                  </div>
                </div>

                {selectedHistoryItem && (
                  <div className="playground-panel">
                    <div className="input-wrapper">
                      <div className="input-label">Old Input</div>
                      <TextArea disabled placeholder="Input..." />
                    </div>
                    <div className="input-wrapper">
                      <div className="input-label">Old Output</div>
                      <TextArea disabled placeholder="Output..." />
                    </div>
                  </div>
                )}
              </div>
              <div className="actions">
                <Button type="submit" color="green">Submit</Button>
                <Icon name="history" onClick={e => setOpenHistory(true)} />
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
                step={0.1}
                onChange={e => setTemperature(e.target.value)}
              />
              <RangeItem
                label="Maximum length"
                value={maxLen}
                max={4096}
                min={0}
                step={1}
                onChange={e => setMaxLen(e.target.value)}
              />
              <RangeItem
                label="Top P"
                value={topP}
                max={10}
                min={0}
                step={1}
                onChange={e => setTopP(e.target.value)}
              />
              <RangeItem
                label="Frequency penalty"
                value={freqency}
                max={1}
                min={0}
                step={0.1}
                onChange={e => setFrequency(e.target.value)}
              />
              <RangeItem
                label="Presence penalty"
                value={presence}
                max={1}
                min={0}
                step={0.1}
                onChange={e => setPresence(e.target.value)}
              />
              <RangeItem
                label="Best of"
                value={bestOf}
                max={10}
                min={0}
                step={1}
                onChange={e => setBestOf(e.target.value)}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
