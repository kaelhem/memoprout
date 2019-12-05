export const types = {
  REGISTER: 'qry/user/REGISTER',
  LOGIN: 'qry/user/LOGIN',
  LOGIN_SUCCESS: 'qry/user/LOGIN_SUCCESS',
  UPDATE_TOKEN: 'qry/user/UPDATE_TOKEN',
  LOGOUT: 'qry/user/LOGOUT',
  FORGOT_PASSWORD: 'qry/user/FORGOT_PASSWORD',
  CHANGE_PASSWORD: 'qry/user/CHANGE_PASSWORD',
  CHECK_MAIL: 'qry/user/CHECK_MAIL'
}

const initialState = {
  isLogged: false,
  token: null,
  profile: null
}

export default function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.LOGIN_SUCCESS: {
      return {
        ...state,
        isLogged: true,
        profile: action.payload
      }
    }
    case types.UPDATE_TOKEN: {
      return {
        ...state,
        token: action.payload
      }
    }
    case types.LOGOUT: {
      return { 
        ...initialState
      }
    }
    default:
      return state
  }
}

export const actions = {
  register: (userData) => ({type: types.REGISTER, payload: userData}),
  login: (credentials) => ({type: types.LOGIN, payload: credentials}),
  logout: () => ({type: types.LOGOUT}),
  updateToken: (token) => ({type: types.UPDATE_TOKEN, payload: token}),
  forgotPass: (mail) => ({type: types.FORGOT_PASSWORD, payload: mail}),
  changePassword: (password) => ({type: types.CHANGE_PASSWORD, payload: password}),
  checkMail: (key) => ({type: types.CHECK_MAIL, payload: key})
}

export const messages = {
  loginSuccess: (profile) => ({type: types.LOGIN_SUCCESS, payload: profile})
}

export const selectors = {
  isLogged: (state) => state.user.isLogged,
  token: (state) => state.user.token,
  profile: (state) => state.user.profile,
  fullname: (state) => {
    let names = []
    if (state.user.profile && state.user.profile.firstname) {
      names = state.user.profile.firstname.split(' ').map(x => x.charAt(0).toUpperCase() + x.toLowerCase().slice(1))
      if (state.user.profile.lastname) {
        names.push(state.user.profile.lastname.toUpperCase())
      }
    }
    return names.join(' ')
  },
  initials: (state) => {
    let initials = ''
    if (state.user.profile && state.user.profile.firstname) {
      initials += state.user.profile.firstname.split(' ').map(x => x.charAt(0).toUpperCase()).join('')
      if (state.user.profile.lastname) {
        initials += state.user.profile.lastname.charAt(0).toUpperCase()
      }
    }
    return initials
  }
}