import React, { Fragment } from 'react'

import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app'
import 'firebase/auth'

import { Button, Divider } from 'semantic-ui-react'
import UserForm from 'components/user-form'

const firebaseAppAuth = firebaseApp.auth()
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
}

const FormWrapper = ({ children }) => (
  <Fragment>
    { children }
    <hr />
  </Fragment>
)

const App = (props) => {
  const {
    user,
    error,
    signOut,
    signInWithGoogle,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
  } = props

  return (
    <div className="app">
      <header className="app-header">
        {
          error && <div>{ error }</div>
        }
        <div>
          <div>
            <p>Connectez-vous</p>
            <FormWrapper>
              <h1>Je me connecte avec email / mot de passe</h1>
              <UserForm onSubmit={signInWithEmailAndPassword} />
            </FormWrapper>
            <Button onClick={signInWithGoogle}>Je me connecte avec mon compte Google</Button>
            <Divider horizontal />
            <p>Pas encore de compte ?</p>
            <FormWrapper>
              <h1>Je m'inscris</h1>
              <UserForm onSubmit={createUserWithEmailAndPassword} />
            </FormWrapper>
          </div>
        </div>
      </header>
    </div>
  )
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth
})(App)