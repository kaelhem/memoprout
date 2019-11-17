import React, { useState, Fragment } from 'react'
import Spinner from 'components/spinner'

const encode = (data) => (
  Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
)

const Contact = () => {

  const [status, setStatus] = useState('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    setStatus('pending')
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': 'contact', name, email, message })
    })
    .then(() => setStatus('sent'))
    .catch(error => setStatus('error'))
  };

  const allFieldsAreFilled = () => name && email && message

  const renderForm = () => (
    <form name="contact" onSubmit={handleSubmit}>
      <input type="hidden" name="form-name" value="contact" />
      <p>
        <label><span>Nom :</span><input type="text" value={name} onChange={ e => setName(e.target.value) }/></label>
      </p>
      <p>
        <label><span>Email :</span><input type="email" value={email} onChange={ e => setEmail(e.target.value) }/></label>
      </p>
      <p>
        <label><span>Message :</span><textarea value={message} onChange={ e => setMessage(e.target.value) }></textarea></label>
      </p>
      <p style={{ textAlign: 'right', marginRight: 1 }}>
        <button disabled={ !allFieldsAreFilled() } type="submit">Envoyer</button>
      </p>
    </form>
  )

  const renderSent = () => (
    <div style={{fontSize: '1.2em'}}>
      <div>Merci !</div>
      <div>Votre message à bien été envoyé !</div>
    </div>
  )

  const renderError = () => (
    <div>
      <div>Une erreur est survenue...</div>
      <button onClick={ () => setStatus('form') }>Réessayer</button>
    </div>
  )

  return (
    <Fragment>
      <h2>Contactez-nous</h2>
      <p>Si vous avez une question, une remarque ou autre, vous pouvez nous le dire, on prendra le temps de vous répondre.</p>
      { status === 'form' && renderForm() }
      { status === 'pending' && <Spinner /> }
      { status === 'sent' && renderSent() }
      { status === 'error' && renderError() }
    </Fragment>
  )
}

export default Contact
