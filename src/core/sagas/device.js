import { all, fork, takeEvery, put, call, delay } from 'redux-saga/effects'
import {
  types as deviceTypes,
  messages as deviceMessages
} from 'core/reducers/device'
import avrbro from 'avrbro'
const { openSerial, closeSerial, parseHex, flash, reset } = avrbro

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

const readFileAsync = (file) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

const flashHexFile = async () => {
  const response = await fetch('bin/memoproutpad-old-bootloader-v1.hex')
  const data = await response.blob()
  const fileData = await readFileAsync(data)
  const hexBuffer = parseHex(new TextDecoder("utf-8").decode(fileData))
  await reset(serial)
  await flash(serial, hexBuffer, { boardName: 'nano' })
}

function *enterUpdateMode() {
  let i = 0
  while (i < 10) {
    yield delay(1)
    yield call(writeSerial, '1')
    yield call(readSerial)
    ++i
  }
}

export function *connectSaga(action) {
  serial = yield call(openSerial)
  if (serial) {
    let readValue = yield call(readSerial)
    if (readValue === 'STARTUP') {
      yield enterUpdateMode()
      yield call(writeSerial, 'VER')
      const version = yield call(readSerial)
      yield call(writeSerial, 'LSGAMES')
      readValue = yield call(readSerial)
      const games = readValue.split('\n')
      yield put(deviceMessages.setConnected(version, games))
    }
  } else {
    yield put(deviceMessages.setDisconnected())
  }
}

export function *disconnectSaga(action) {
  serial.reader.cancel()
  yield call(writeSerial, 'EXIT')
  yield call(closeSerial, serial)
  yield put(deviceMessages.setDisconnected())
}


export function *flashSaga(action) {
  try {
    yield call(flashHexFile)
    yield enterUpdateMode()
    yield call(writeSerial, 'VER')
    const version = yield call(readSerial)
    yield put(deviceMessages.setVersion(version))
    yield put(deviceMessages.setFlashed())
  } catch(e) {
    yield put(deviceMessages.setFlashError())
  }
}

export function *watchConnect() {
  yield takeEvery(deviceTypes.CONNECT, connectSaga)
}

export function *watchDisconnect() {
  yield takeEvery(deviceTypes.DISCONNECT, disconnectSaga)
}

export function *watchFlash() {
  yield takeEvery(deviceTypes.FLASH, flashSaga)
}

export function *deviceSaga() {
  yield all([
    fork(watchConnect),
    fork(watchDisconnect),
    fork(watchFlash)
  ])
}