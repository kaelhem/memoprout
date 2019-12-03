import { all, fork } from 'redux-saga/effects'

function *appSaga() {
  yield all([
    //fork(userSaga),
  ])
}

export default () => all([
  fork(appSaga)
])