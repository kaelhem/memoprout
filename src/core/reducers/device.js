export const types = {
  CONNECT: 'mpp/device/CONNECT',
  CONNECTED: 'mpp/device/CONNECTED',
  DISCONNECT: 'mpp/device/DISCONNECT',
  DISCONNECTED: 'mpp/device/DISCONNECTED',
  FLASH: 'mpp/device/FLASH',
  FLASHED: 'mpp/device/FLASHED',
  FLASH_ERROR: 'mpp/device/FLASH_ERROR'
}

const initialState = {
  error: null,
  isPending: false,
  isConnected: false,
  isFlashing: false,
  flashError: false,
  version: null,
  games: null
}

export default function deviceReducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.CONNECT:
    case types.DISCONNECT: {
      return {
        ...state,
        isPending: true
      }
    }
    case types.CONNECTED: {
      const { version, games } = action.payload
      return {
        ...state,
        isPending: false,
        isConnected: true,
        version,
        games
      }
    }
    case types.DISCONNECTED: {
      return {
        ...state,
        isPending: false,
        isConnected: false,
        version: null,
        games: null
      }
    }
    case types.FLASH: {
      return {
        ...state,
        isFlashing: true,
        flashError: false
      }
    }
    case types.FLASHED: {
      return {
        ...state,
        isFlashing: false
      }
    }
    case types.FLASH_ERROR: {
      return {
        ...state,
        isFlashing: false,
        flashError: true
      }
    }
    default:
      return state
  }
}

export const actions = {
  connect: () => ({type: types.CONNECT}),
  disconnect: () => ({type: types.DISCONNECT}),
  flash: () => ({type: types.FLASH})
}

export const messages = {
  setConnected: (version, games) => ({type: types.CONNECTED, payload: { version, games }}),
  setDisconnected: () => ({type: types.DISCONNECTED}),
  setFlashed: () => ({type: types.FLASHED}),
  setFlashError: () => ({type: types.FLASH_ERROR})
}

export const selectors = {
  isPending: (state) => state.device.isPending,
  isConnected: (state) => state.device.isConnected,
  isFlashing: (state) => state.device.isFlashing,
  getVersion: (state) => state.device.version,
  getGames: (state) => state.device.games
}