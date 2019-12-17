import { all, fork } from 'redux-saga/effects'
import { deviceSaga } from './device'

function *appSaga() {
  yield all([
    fork(deviceSaga),
  ])
}

export default () => all([
  fork(appSaga)
])