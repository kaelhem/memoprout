import { all, fork, takeEvery, put, call } from 'redux-saga/effects'
import {
  types as deviceTypes,
  messages as deviceMessages
} from 'core/reducers/device'
import avrbro from 'avrbro'
const { openSerial, closeSerial /*, parseHex, flash*/ } = avrbro

// keep a reference to the serial connection
let serial = null

const readSerial = async () => {
  if (serial) {
    const {value, done} = await serial.reader.read()
    if (value && !done) {
      return new TextDecoder("utf-8").decode(value).trim()
    }
    throw new Error('cannot read serial value')
  } else {
    throw new Error('serial is not available')
  }
}

const writeSerial = (str) => {
  if (serial) {
    serial.writer.write(new TextEncoder("utf-8").encode(str + '\n'))
  } else {
    throw new Error('serial is not available')
  }
}

/*
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
}*/

export function *connectSaga(action) {
  console.log('connectSaga');
  serial = yield call(openSerial)
  if (serial) {
    let readValue = yield call(readSerial)
    if (readValue === 'STARTUP') {
      yield call(writeSerial, 'VER')
      const version = yield call(readSerial)
      yield call(writeSerial, 'LSGAMES')
      readValue = yield call(readSerial)
      const games = readValue.split('\n')
      yield put(deviceMessages.setConnected(version, games))
    } else {
      console.log('received: ' + readValue)
    }
  } else {
    yield put(deviceMessages.setDisconnected())
  }
}

export function *disconnectSaga(action) {
  console.log('disconnectSaga', serial);
  serial.reader.cancel()
  yield call(writeSerial, 'EXIT')
  yield call(closeSerial, serial)
  yield put(deviceMessages.setDisconnected())
}

export function *watchConnect() {
  yield takeEvery(deviceTypes.CONNECT, connectSaga)
}

export function *watchDisconnect() {
  yield takeEvery(deviceTypes.DISCONNECT, disconnectSaga)
}

export function *deviceSaga() {
  yield all([
    fork(watchConnect),
    fork(watchDisconnect)
  ])
}