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
  while (i < 100) {
    yield call(writeSerial, '1')
    yield call(readSerial)
    yield delay(1)
    ++i
  }
}

export function *connectSaga(action) {
  serial = yield call(openSerial)
  if (serial) {
    let updateModeOK = false
    while (!updateModeOK) {
      let readValue = yield call(readSerial)
      if (readValue.substr(-7) === 'STARTUP') {
        console.log('STARTUP detected !')
        updateModeOK = true
        yield enterUpdateMode()
        yield call(writeSerial, 'VER')
        const version = yield call(readSerial)
        yield call(writeSerial, 'LSGAMES')
        readValue = yield call(readSerial)
        const games = readValue.split('\n')
        yield put(deviceMessages.setConnected(version, games))
      } else {
        console.log('instead of STARTUP, i\'ve read: <' + readValue + '>')
      }
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


/* Oh my god... wtf am I doing 0_0 */
export function *installSaga(action) {
  console.log('install saga')
  const { game, fileUrls, fileNames } = action.payload

  // create directory
  yield call(writeSerial, 'MKDIR')
  yield delay(1)
  yield call(writeSerial, game.code)

  const mkDirResponse = yield call(readSerial)
  if (mkDirResponse === '1') {
    let fileIndex = 1
    for (let url of fileUrls) {
      console.log(`fetching file ${fileIndex} / ${fileUrls.length}`)
      
      // fetch file and put it in an arrayBuffer
      const response = yield call(fetch, url)
      const data = yield response.blob()
      const fileBuffer = yield call(readFileAsync, data)

      // start upload process
      yield call(writeSerial, 'UP')
      yield delay(1)

      // send filename
      const filename = fileNames[fileIndex - 1]
      if (filename.indexOf('.wav') !== -1) {
        console.log('will create file: ' + game.code.trim() + '/' + filename)
        yield call(writeSerial, game.code.trim() + '/' + filename)
      } else {
        console.log('will create file: GAMES/' + filename)
        yield call(writeSerial, 'GAMES/' + filename)
      }
      const mkFileResponse = yield call(readSerial)
      if (mkFileResponse === '1') {
        yield delay(100)

        // send file size
        const bufferLen = fileBuffer.byteLength
        console.log('bufferLen=' + bufferLen)
        yield call(writeSerial, bufferLen.toString())

        const fileSizeResponse = yield call(readSerial)
        if (fileSizeResponse === '1') {
          yield delay(100)
          /*let sentBytes = 0
          while (sentBytes < bufferLen) {
            console.log('sending ' + sentBytes + ' / ' + bufferLen)
            const size = Math.min(1024, bufferLen - sentBytes)
            */
            yield serial.writer.write(fileBuffer)//.slice(sentBytes, size))
            //sentBytes += size
            //yield delay(1000)
            /*
            const chunkResponse = yield call(readSerial)
            console.log('chunkResponse: ', chunkResponse)
            if (chunkResponse === 'CHUNK_OK') {
              console.log('chunk ok')
            }
            */
          //}
          console.log('wait OK...')
          let uploadOK = false
          while (!uploadOK) {
            yield delay(10)
            const uploadResponse = yield call(readSerial)
            console.log('received: ' + uploadResponse)
            if (uploadResponse.substr(-4) === 'NEXT') {
              console.log('file copied successfully')
              uploadOK = true
            } else {
              console.log('still copying I guess...')
            }
          }
        } else {
          console.log('error: file size is invalid... received:', fileSizeResponse)
          yield put(deviceMessages.setInstallError())
          break  
        }
      } else {
        console.log('error: cannot create file... received:', mkFileResponse)
        yield put(deviceMessages.setInstallError())
        break
      }
      yield delay(500)
      ++fileIndex
    }
  } else {
    console.log('error: cannot create directory..., received:', mkDirResponse)
    yield put(deviceMessages.setInstallError())
  }

  /*
  // create directory
  yield call(writeSerial, 'MKDIR')
  yield delay(1)
  yield call(writeSerial, game.code)
  const mkDirResponse = yield call(readSerial)
  if (mkDirResponse === '1') {
    let fileIndex = 1
    for (let url of fileUrls) {
      console.log(`fetching file ${fileIndex} / ${fileUrls.length}`)
      const response = yield call(fetch, url)
      const data = yield response.blob()
      const fileBuffer = yield call(readFileAsync, data)
      yield call(writeSerial, 'UP')
      yield delay(1)
      const filename = fileNames[fileIndex - 1]
      if (filename.indexOf('.wav') !== -1) {
        console.log('will create file: ' + game.code.trim() + '/' + filename)
        yield call(writeSerial, game.code.trim() + '/' + filename)
      } else {
        console.log('will create file: ' + 'GAMES/' + filename)
        yield call(writeSerial, 'GAMES/' + filename)
      }
      const mkFileResponse = yield call(readSerial)
      if (mkFileResponse === '1') {
        yield call(writeSerial, fileBuffer.byteLength)
        const fileSizeResponse = yield call(readSerial)
        if (mkFileResponse === '1') {
          // starting file transfert !
          let sentBytes = 0
          while (sentBytes < fileBuffer.byteLength) {
            console.log('sending bytes...')
            yield serial.writer.write(fileBuffer.slice(sentBytes, sentBytes + 256))
            sentBytes += 256
            yield delay(100)
          }
        } else {
          yield put(deviceMessages.setInstallError())
          break  
        }
      } else {
        yield put(deviceMessages.setInstallError())
        break
      }
      break
      ++fileIndex
    }
  } else {
    yield put(deviceMessages.setInstallError())
  }
  */
}

export function *uninstallSaga(action) {
  console.log('uninstall saga')
  yield 
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

export function *watchInstall() {
  yield takeEvery(deviceTypes.INSTALL, installSaga)
}

export function *watchUninstall() {
  yield takeEvery(deviceTypes.UNINSTALL, uninstallSaga)
}

export function *deviceSaga() {
  yield all([
    fork(watchConnect),
    fork(watchDisconnect),
    fork(watchFlash),
    fork(watchInstall),
    fork(watchUninstall)
  ])
}