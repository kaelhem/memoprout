import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import ProtectedRoute from 'containers/protected-route'
import Menu from 'containers/menu'
// views
import Home from 'views/home'
import MyMemo from 'views/my-memoprout'
import MemoStore from 'views/memo-store'
import MemoMaker from 'views/create-game'
import Mentions from './views/legal-mentions'

import AppModals from './app-modals'

const Routes = () => (
  <Fragment>
    <Menu />
    <Switch>
      <Route exact path="/" component={ Home } />
      <ProtectedRoute path="/mon-memoprout-pad" component={ MyMemo } />
      <ProtectedRoute path="/memo-store" component={ MemoStore } />
      <ProtectedRoute path="/memo-maker" component={ MemoMaker } />
      <ProtectedRoute path="/mentions" component={ Mentions } />
      <Redirect to="/" />
    </Switch>
    { /* MODALS */ }
    <AppModals />
  </Fragment>
)

const mapStateToProps = () => ({})

export default connect(mapStateToProps)(Routes)


/*
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import firebaseConfig from './firebase-config'

import React, { Fragment } from 'react'
import { Button, Divider } from 'semantic-ui-react'
import UserForm from './user-form'
import avrbro from 'avrbro'
import './app.css'

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAppAuth = firebaseApp.auth()
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const { openSerial, parseHex, flash } = avrbro

let serial = null

const handleDeviceConnect = async () => {
  serial = await openSerial()
}

const flashHexFile = async () => {
  try {
    const response = await fetch('bin/sample.hex')
    const data = await response.json()
    const hexBuffer = parseHex(new TextDecoder("utf-8").decode(data))
    const success = await flash(serial, hexBuffer, { boardName: 'nano' })
    console.log(success ? 'Success' : 'Fail')
    
  } catch(e) {
    console.log(e)
  }  
}

const readSerial = async () => {
  while (true) {
    const {value, done} = await reader.read()
    if (done) {
      break
    }
    console.log(new TextDecoder("utf-8").decode(value))
  }
}

const ledON = () => {
  serial.writer.write(new TextEncoder("utf-8").encode('ledON\n'))
}

const ledOFF = () => {
  serial.writer.write(new TextEncoder("utf-8").encode('ledOFF\n'))
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
          { !user ? (
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
          ):(
            <div>
              { navigator.serial ? (
                <div>
                  { !serial ? (
                    <Button onClick={ handleDeviceConnect }>Open serial connection</Button>
                  ) : (
                    <Fragment>
                      <Button onClick={ flashHexFile }>flash hex file</Button>
                    </Fragment>
                  )}
                </div>
              ):(
                <p>You need to open this page on Chrome web browser, AND activate this option : chrome://flags/#enable-experimental-web-platform-features</p>
              )}
              <Button onClick={signOut}>Je me déconnecte</Button>
            </div>
          )}
        </div>
      </header>
    </div>
  )
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth
})(App)
*/