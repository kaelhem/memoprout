export const types = {
  CONNECT: 'mpp/device/CONNECT',
  CONNECTED: 'mpp/device/CONNECTED',
  DISCONNECT: 'mpp/device/DISCONNECT',
  DISCONNECTED: 'mpp/device/DISCONNECTED',
  FLASH: 'mpp/device/FLASH',
  FLASHED: 'mpp/device/FLASHED',
  FLASH_ERROR: 'mpp/device/FLASH_ERROR',
  UPDATE_VERSION: 'mpp/device/UPDATE_VERSION',
  UPDATE_GAMES: 'mpp/device/UPDATE_GAMES',
  INSTALL: 'mpp/device/INSTALL',
  INSTALLED: 'mpp/device/INSTALLED',
  INSTALL_ERROR: 'mpp/device/INSTALL_ERROR',
  UNINSTALL: 'mpp/device/UNINSTALL',
  UNINSTALLED: 'mpp/device/UNINSTALLED',
  UNINSTALL_ERROR: 'mpp/device/UNINSTALL_ERROR'
}

const initialState = {
  error: null,
  isPending: false,
  isConnected: false,
  isInstalling: false,
  isUninstalling: false,
  installError: false,
  uninstallError: false,
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
    case types.UPDATE_VERSION: {
      return {
        ...state,
        version: action.payload
      }
    }
    case types.UPDATE_GAMES: {
      return {
        ...state,
        games: action.payload
      }
    }
    case types.INSTALL: {
      return {
        ...state,
        isInstalling: true,
        installError: false
      }
    }
    case types.INSTALLED: {
      return {
        ...state,
        isInstalling: false
      } 
    }
    case types.INSTALL_ERROR: {
      return {
        ...state,
        isInstalling: false,
        installError: true
      } 
    }
    case types.UNINSTALL: {
      return {
        ...state,
        isUninstalling: true,
        uninstallError: false
      }
    }
    case types.UNINSTALLED: {
      return {
        ...state,
        isUninstalling: false
      }
    }
    case types.UNINSTALL_ERROR: {
      return {
        ...state,
        isUninstalling: false,
        uninstallError: true
      }
    }
    default:
      return state
  }
}

export const actions = {
  connect: () => ({type: types.CONNECT}),
  disconnect: () => ({type: types.DISCONNECT}),
  flash: () => ({type: types.FLASH}),
  install: (game, fileUrls, fileNames) => ({type: types.INSTALL, payload: {game, fileUrls, fileNames}}),
  uninstall: (game) => ({type: types.UNINSTALL, payload: game})
}

export const messages = {
  setConnected: (version, games) => ({type: types.CONNECTED, payload: { version, games }}),
  setDisconnected: () => ({type: types.DISCONNECTED}),
  setFlashed: () => ({type: types.FLASHED}),
  setFlashError: () => ({type: types.FLASH_ERROR}),
  setVersion: (version) => ({type: types.UPDATE_VERSION, payload: version}),
  setGames: (games) => ({type: types.UPDATE_GAMES, payload: games}),
  setInstalled: () => ({type: types.INSTALLED}),
  setInstallError: () => ({type: types.INSTALL_ERROR}),
  setUninstalled: () => ({type: types.UNINSTALLED}),
  setUninstallError: () => ({type: types.UNINSTALL_ERROR})
}

export const selectors = {
  isPending: (state) => state.device.isPending,
  isConnected: (state) => state.device.isConnected,
  isFlashing: (state) => state.device.isFlashing,
  getVersion: (state) => state.device.version,
  getGames: (state) => state.device.games
}