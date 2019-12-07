import React, { useState, Fragment } from 'react'
import { Button, Divider, Form, Grid } from 'semantic-ui-react'
import GoogleButton from 'react-google-button'

const LoginForm = ({isLargeScreen, onEmailLogin, onGoogleLogin, forgotPassword}) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' })

  return (
    <Fragment>
      <Grid columns={2} relaxed='very' stackable>
        <Grid.Column>
          <div style={{ margin: '1em' }}>Je me connecte avec mon email et mot de passe</div>
          <Form>
            <Form.Input
              icon='mail'
              iconPosition='left'
              placeholder='E-Mail'
              name='email'
              value={ credentials.email }
              onChange={ (e, { name, value }) => setCredentials({...credentials, [name]: value }) }
            />
            <Form.Input
              icon='lock'
              iconPosition='left'
              type='password'
              name='password'
              placeholder='Mot de passe'
              value={ credentials.password }
              onChange={ (e, { name, value }) => setCredentials({...credentials, [name]: value }) }
            />
            <a href="#"
              onClick={ forgotPassword }
              style={{ 
                fontStyle: 'italic',
                fontSize: 11,
                marginTop: -14,
                width: '100%',
                left: 0,
                position: 'absolute'
              }}
            >J'ai oublié mon mot de passe</a>
            <Button disabled={ !credentials.email || !credentials.password } style={{ marginTop: 30 }} type='submit' content='Se connecter' primary onClick={ () => onEmailLogin(credentials) } />
          </Form>
          { !isLargeScreen && (
            <Divider horizontal style={{ marginTop: '1em' }}>OU</Divider>
          )}
        </Grid.Column>
        <Grid.Column verticalAlign='middle'>
          <div>J'utilise mon compte Google</div>
          <div style={{ display: 'flex', margin: '1em' }}>
            <GoogleButton onClick={ onGoogleLogin } label='Se connecter' style={{ margin: 'auto' }} />
          </div>
        </Grid.Column>
      </Grid>
      { isLargeScreen && (
        <Divider vertical>OU</Divider>
      )}
    </Fragment>
  )
}

export default LoginForm