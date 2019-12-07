import React, { useState } from 'react'
import { Button, Form, Input, Checkbox } from 'semantic-ui-react'
import ButtonLink from 'components/button-link'
import './login.css'

const CreateAccount = ({ goBack, createUser }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    passwordBis: '',
    pseudo: '',
    mentions: false
  }) 

  const handleChange = (e, { name, value }) => setCredentials({...credentials, [name]: value })

  const canSubmit = () => {
    const { email, password, passwordBis, pseudo, mentions } = credentials
    return email !== '' && password.length >= 6 && password === passwordBis && pseudo !== '' && mentions
  }

  return (
    <div className="create-account">
      <h4>Créer un compte</h4>
      <p>En créant un compte votre MemoProut Pad va prendre une toute autre dimension !</p>
      <Form>
        <Form.Group inline>
          <label>Nom d'utilisateur</label>
          <Input
            icon='user'
            iconPosition='left'
            name='pseudo'
            value={ credentials.pseudo }
            onChange={ handleChange }
          />
        </Form.Group>
        <Form.Group inline>
          <label>E-mail</label>
          <Input
            icon='mail'
            iconPosition='left'
            name='email'
            value={ credentials.email }
            onChange={ handleChange }
          />
        </Form.Group>
        <Form.Group inline>
          <label>Mot de passe</label>
          <Input
            icon='lock'
            iconPosition='left'
            type='password'
            name='password'
            value={ credentials.password }
            onChange={ handleChange }
          />
        </Form.Group>
        <Form.Group inline>
          <label>Confirmer le mot de passe</label>
          <Input
            icon='lock'
            iconPosition='left'
            type='password'
            name='passwordBis'
            value={ credentials.passwordBis }
            onChange={ handleChange }
          />
        </Form.Group>
        <Form.Group inline style={{ padding: '1em' }}>
          <Checkbox name='mentions' style={{ maxWidth: 20 }} checked={ credentials.mentions } onChange={ (e, {checked}) => setCredentials({...credentials, mentions: checked }) } />
          <p><a href="/mentions" target="_blank">J'ai lu</a> et j'accepte les conditions d'utilisation</p>
        </Form.Group>
        <Button style={{ marginTop: 10 }} disabled={ !canSubmit() } content='Valider' primary onClick={ () => createUser(credentials) } />
      </Form>
      <ButtonLink onClick={ goBack }>En fait, j'ai déjà un compte !</ButtonLink>
    </div>
  )
}

export default CreateAccount