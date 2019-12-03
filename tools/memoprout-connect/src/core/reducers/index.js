import { combineReducers } from 'redux'
import * as storage from 'redux-storage'
import { connectRouter } from 'connected-react-router'
import user from './user'
import modal from './modal'
import page from './page'

const createRootReducer = (history) => storage.reducer(combineReducers({
  router: connectRouter(history),
  user,
  modal,
  page
}))

export default createRootReducer