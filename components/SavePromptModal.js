import React from 'react'
import { Button, Form, Modal } from 'semantic-ui-react'

function SavePromptModal() {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')

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
          content="Save"
          onClick={() => setOpen(false)}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default SavePromptModal
