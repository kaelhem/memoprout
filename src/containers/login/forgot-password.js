import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import ButtonLink from 'components/button-link'

const ForgotPassword = ({ goBack, retrievePassword }) => {
  const [email, setEmail] = useState('')

  return (
    <div>
      <p>Vous avez oublié votre mot de passe ?
      <br/>Saissez votre e-mail nous vous enverrons un lien afin de de vous connecter.</p>
      <Form>
        <Form.Input
          icon='user'
          iconPosition='left'
          placeholder='Utilisateur'
          value={ email }
          onChange={ (e, { value }) => setEmail(value) }
        />
        <Button style={{ marginTop: 10 }} content='Valider' primary onClick={ () => retrievePassword(email) } />
      </Form>
      <ButtonLink onClick={ goBack }>En fait, je m'en souviens !</ButtonLink>
    </div>
  )
}

export default ForgotPassword