import React, { useState, useEffect } from 'react'
import { Modal, Button, Segment, Form } from 'semantic-ui-react'

export default ({ isPending, error, isOpen, ...props }) => {
  
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (error) {
      setShake(true)
      let timer = setTimeout(() => setShake(false), 300)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [error])

  const handleClose = () => {
    if (!isPending) {
      props.onClose()
    }
  }

  const handleValidate = () => {
    const shouldClose = props.onValidate()
    if (shouldClose) {
      handleClose()
    }
  }

  return (
    <Modal
      size="tiny"
      open={ isOpen }
      onClose={ handleClose }
      className={ shake ? 'shake-horizontal shake-constant' : '' }
    >
      <Modal.Header style={{ background: '#b9b9b9' }}>{ props.title }</Modal.Header>
      <Modal.Content>
        { error && (
          <Segment color='red'>
            { error }
          </Segment>
        )}
        <Form size='small' onSubmit={ () => props.canValidate && handleValidate() }>
          <Button type='submit' style={{ display: 'none' }}></Button>
          { props.children }
        </Form>
      </Modal.Content>
      <Modal.Actions>
        {
          props.canCancel && (
            <Button
              id='modal-cancel-button'
              onClick={ handleClose }
              disabled={ isPending }
            >Annuler</Button>
          )
        }
        <Button
          id='modal-validate-button'
          primary
          onClick={ handleValidate }
          disabled={ !props.canValidate }
          loading={ isPending }
        >Ok</Button>
      </Modal.Actions>
    </Modal>
  )
}