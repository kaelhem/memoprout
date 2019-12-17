export const types = {
  CONNECT: 'mpp/device/CONNECT',
  CONNECTED: 'mpp/device/CONNECTED',
  DISCONNECT: 'mpp/device/DISCONNECT',
  DISCONNECTED: 'mpp/device/DISCONNECTED'
}

const initialState = {
  error: null,
  isPending: false,
  isConnected: false,
  version: null,
  games: null
}

export default function deviceReducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.CONNECT:
    case types.DISCONNECT: {
      return {
        ...initialState,
        isPending: true
      }
    }
    case types.CONNECTED: {
      const { version, games } = action.payload
      return {
        ...initialState,
        isPending: false,
        isConnected: true,
        version,
        games
      }
    }
    case types.DISCONNECTED: {
      return {
        ...initialState,
        isPending: false,
        isConnected: false,
        version: null,
        games: null
      }
    }
    default:
      return state
  }
}

export const actions = {
  connect: () => ({type: types.CONNECT}),
  disconnect: () => ({type: types.DISCONNECT})
}

export const messages = {
  setConnected: (version, games) => ({type: types.CONNECTED, payload: { version, games }}),
  setDisconnected: () => ({type: types.DISCONNECTED})
}

export const selectors = {
  isPending: (state) => state.device.isPending,
  isConnected: (state) => state.device.isConnected,
  getVersion: (state) => state.device.version,
  getGames: (state) => state.device.games
}