import { applyMiddleware } from 'redux'
import combineActionsMiddleware from 'redux-combine-actions'
import createSagaMiddleware from 'redux-saga'
import getSagas from '../sagas'
import * as storage from 'redux-storage'
import createStorageEngine from 'redux-storage-engine-localstorage'
import filter from 'redux-storage-decorator-filter'
import debounce from 'redux-storage-decorator-debounce'
import { routerMiddleware } from 'connected-react-router'

// And with the engine we can create our middleware function. The middleware
// is responsible for calling `engine.save` with the current state afer
// every dispatched action.
//
// Note: You can provide a list of action types as second argument, those
//       actions will be filtered and WON'T trigger calls to `engine.save`!
const engine = debounce(filter(createStorageEngine('MppConnect'), [
  'user'
]), 1000)
const storageMiddleware = storage.createMiddleware(engine, [], [
  // Actions with these types will trigger a save of the store in the local storage
  // user.CONNECTED,
  // user.REGISTER_TOKEN,
  // user.FORGOT_TOKEN
])

const sagaMiddleware = createSagaMiddleware()

export default function createMiddlewares(history) {
  return applyMiddleware(
    routerMiddleware(history),
    combineActionsMiddleware,
    storageMiddleware,
    sagaMiddleware
  )
}

export function runSaga() {
  let sagaTask = sagaMiddleware.run(function* () {
    yield getSagas()
  })
  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('../sagas', () => {
      const getNewSagas = require('../sagas').default
      sagaTask.cancel()
      sagaTask.done.then(() => {
        sagaTask = sagaMiddleware.run(function* () {
          yield getNewSagas()
        })
      })
    })
  }
}

export function loadFromLocalStorage(store) {
  return storage.createLoader(engine)(store)
}
