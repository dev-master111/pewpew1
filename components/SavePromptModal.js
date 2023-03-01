import React from 'react'
import { Button, Form, Modal } from 'semantic-ui-react'

function SavePromptModal({ onSubmit, text, prompts, current }) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')

  React.useEffect(() => {
    if (!open) {
      setName('')
      setDescription('')
    } else {
      if (current) {
        const promptDetails = prompts.find(prompt => prompt._id === current)
        setName(promptDetails.name)
        setDescription(promptDetails.description)
      }
    }
  }, [open])

  const handleSubmit = async () => {
    try {
      let response

      if (current) {
        response = await fetch('/api/prompts', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: current,
            name,
            description,
            text
          })
        })
      } else {
        response = await fetch('/api/prompts', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            description,
            text
          })
        })
      }

      const responseData = await response.json()
      if (responseData && Array.isArray(responseData)) {
        onSubmit(responseData)
      }
    } catch (error) {
      setOutputText('')
    }

    setOpen(false)
  }

  const onSaveAsNew = async () => {
    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          description,
          text
        })
      })

      const responseData = await response.json()
      if (responseData && Array.isArray(responseData)) {
        onSubmit(responseData)
      }
    } catch (error) {
      setOutputText('')
    }

    setOpen(false)
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Save</Button>}
      size="tiny"
    >
      <Modal.Header>Save Prompt</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>
            This will save the current playground state as a prompt which you can access later or share with others
          </p>
          <Form>
            <Form.Input
              value={name}
              onChange={e => setName(e.target.value)}
              label="Name"
            />
            <Form.TextArea
              value={description}
              onChange={e => setDescription(e.target.value)}
              label="Descripion (optional)"
            />
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          onClick={onSaveAsNew}
          disabled={!name}
        >
          Save as new
        </Button>
        <Button
          content={current ? "Update" : "Save"}
          disabled={!name}
          onClick={handleSubmit}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default SavePromptModal
