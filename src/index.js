import React from 'react'
import ReactDOM from 'react-dom'

// polyfills !
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import { Provider } from 'react-redux'
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import firebaseInit from 'firebase-config'
import { ConnectedRouter } from 'connected-react-router'
import configureStore, { history } from 'core/store'
import App from './app'
import 'semantic-ui-css/semantic.min.css'
import './index.css'

configureStore({}).then(store => {

  const rrfProps = firebaseInit(store)

  const render = Component => {
    return ReactDOM.render(
      <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <ConnectedRouter history={history}>
            <Component useSuspense={ false } />
          </ConnectedRouter>
        </ReactReduxFirebaseProvider>
      </Provider>,
      document.getElementById('root')
    )
  }

  render(App)

  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('./app', () => {
        const NextApp = require('./app').default
        render(NextApp)
      })
    }
    // expose store when run in Cypress
    if (window.Cypress) {
      window.store = store
    }
  }
})