import { useState, useEffect } from 'react'
import { Button, Dimmer, Form, Loader, Modal } from 'semantic-ui-react'
import { useUser } from '@auth0/nextjs-auth0/client';

function SavePromptModal({ onSubmit, text, prompts, current }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { user } = useUser();

  useEffect(() => {
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
    setSubmitting(true)

    try {
      let response

      if (current) {
        response = await fetch(`/api/prompts?email=${user.email}`, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: current,
            name,
            description,
            text,
            email: user.email
          })
        })
      } else {
        response = await fetch(`/api/prompts?email=${user.email}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            description,
            text,
            email: user.email
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

    setSubmitting(false)
    setOpen(false)
  }

  const onSaveAsNew = async () => {
    setSubmitting(true)

    try {
      const response = await fetch(`/api/prompts?email=${user.email}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          description,
          text,
          email: user.email
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
    setSubmitting(false)
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Save</Button>}
      size="tiny"
    >
      {submitting && <Dimmer active><Loader /></Dimmer>}
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
          content={current ? "Update" : "Save"}
          disabled={!name}
          onClick={handleSubmit}
        />
        <Button
          onClick={onSaveAsNew}
          disabled={!name}
          positive
        >
          Save as new
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default SavePromptModal
