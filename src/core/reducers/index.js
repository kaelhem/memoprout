import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { firebaseReducer } from 'react-redux-firebase'
import { firestoreReducer } from 'redux-firestore'
import deviceReducer from './device'

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  device: deviceReducer
})

export default createRootReducer