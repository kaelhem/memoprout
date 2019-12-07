import React, { useState, Fragment } from 'react'
import { useFirebase } from 'react-redux-firebase'
import { Loader } from 'semantic-ui-react'
import { Button, Segment, Message, Dimmer, Icon } from 'semantic-ui-react'
import LoginForm from './login-form'
import ForgotPassword from './forgot-password'
import CreateAccount from './create-account'
import Footer from 'containers/footer'
import logo from 'icons/logo.svg'

const LoginView = (props) => {
  const { isLargeScreen } = props
  const firebase = useFirebase()
  const [error, setError] = useState(null)
  const [pending, setPending] = useState(false)
  const [viewState, setViewState] = useState(null)

  const loginWithGoogle = async () => {
    setError(null)
    setPending(true)
    try {
      await firebase.login({ provider: 'google', type: 'popup' })
    } catch(e) {
      // nothing to do here...
    }
    setPending(false)
  }

  const emailLogin = async (credentials) => {
    setError(null)
    setPending(true)
    try {
      await firebase.login(credentials)
    } catch(e) {
      setError('Aucun utilisateur avec ces identifiants. Veuillez réessayer.')
    }
    setPending(false)
  }

  const retrievePassword = async (mail) => {
    setError(null)
    setPending(true)
    try {
      await firebase.auth().sendPasswordResetEmail(mail)
      setViewState('passwordRetrieved')
    } catch(e) {
      setError('Il n\'existe aucun utilisateur avec cet e-mail.')
    }
    setPending(false)
  }

  const createUser = async (userInfo) => {
    const userCredentials = {
      email: userInfo.email,
      password: userInfo.password
    }
    const userProfile = {
      username: userInfo.pseudo,
      email: userInfo.email
    }
    setError(null)
    setPending(true)
    try {
      await firebase.createUser(userCredentials, userProfile)
    } catch(e) {
      if (firebase.auth().currentUser !== null) {
        try {
          await firebase.auth().currentUser.sendEmailVerification()
          setViewState('accountCreated')  
        } catch(err) {
          setError('Impossible d\'envoyer un email...')
        }
      } else {
        setError('Vérifiez les informations saisies et réessayez !')
      }
    }
    setPending(false)
  }

  const createAccount = () => {
    setError(null)
    setViewState('createAccount')
  }

  const forgotPassword = () => {
    setError(null)
    setViewState('forgotPassword')
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ textAlign: 'center', margin: 'auto', padding: '3em 0', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', margin: 'auto', width: 100, height: 100, padding: 20, borderRadius: 60, border: '1px solid #000' }}>
          <img src={ logo } alt="" />
        </div>
        <h2>MemoProut Connect</h2>
        { error && (
            <Message warning style={{ maxWidth: 600, margin: '0.5em auto' }}>
              <Message.Header>Oops, une erreur est survenue</Message.Header>
              <p>{ error }</p>
            </Message>
          )}
        <Segment placeholder style={{ maxWidth: 600, margin: 'auto' }}>
          { pending && (
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>
          )}
          { viewState === 'forgotPassword' && (
            <ForgotPassword
              {...{retrievePassword}}
              goBack={ () => setViewState(null) }
            />
          )}
          { viewState === 'createAccount' && (
            <CreateAccount
              {...{createUser}}
              goBack={ () => setViewState(null) }
            />
          )}
          { viewState === null && (
            <LoginForm
              {...{isLargeScreen, forgotPassword}}
              onGoogleLogin={ loginWithGoogle }
              onEmailLogin={ emailLogin }
            />
          )}
          { viewState === 'passwordRetrieved' && (
            <Fragment>
              <div style={{ textAlign: 'center' }}>
                <Icon name='checkmark' size='big' />
              </div>
              <h4>Vous avez reçu un e-mail !</h4>
              <p>Dans cet e-mail vous trouverez un lien vous permettant de réinitialiser votre mot de passe.</p>
              <Button primary onClick={ () => setViewState(null) }>Ok</Button>
            </Fragment>
          )}
          { viewState === 'accountCreated' && (
            <Fragment>
              <div style={{ textAlign: 'center' }}>
                <Icon name='checkmark' size='big' />
              </div>
              <h4>Vous avez reçu un e-mail !</h4>
              <p>Dans cet e-mail vous trouverez un lien vous permettant de finaliser la création de votre compte.</p>
              <Button primary onClick={ () => setViewState(null) }>Ok</Button>
            </Fragment>
          )}
        </Segment>
        { viewState === null && (
          <p style={{ marginTop: 10 }}>
            Pas encore inscrit ? <Button disabled={ pending } size='mini' onClick={ createAccount }>Je crée mon compte</Button>
          </p>
        )}
      </div>
      <Footer style={{ position: 'absolute', bottom: 0 }} />
    </div>
  )
}

export default LoginView