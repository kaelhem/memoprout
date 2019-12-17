import { createStore, compose } from 'redux'
import { createBrowserHistory } from 'history'
import createRootReducer from './reducers'
import createMiddlewares, { runSaga } from './middlewares'

const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f

export const history = createBrowserHistory()

const configureStore = (initialState) => {
  return new Promise(resolve => {
    const store = createStore(createRootReducer(history), initialState, compose(createMiddlewares(history), reduxDevTools))
    if (process.env.NODE_ENV !== 'production' && module.hot) {
      module.hot.accept('./reducers', () => {
        store.replaceReducer(createRootReducer(history))
      })
    }
    runSaga()
    resolve(store)
  })
}

export default configureStore
