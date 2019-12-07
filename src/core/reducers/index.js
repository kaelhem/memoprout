import { combineReducers } from 'redux'
import * as storage from 'redux-storage'
import { connectRouter } from 'connected-react-router'
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'

const createRootReducer = (history) => storage.reducer(combineReducers({
  router: connectRouter(history),
  firebase: firebaseReducer,
  firestore: firestoreReducer
}))

export default createRootReducer