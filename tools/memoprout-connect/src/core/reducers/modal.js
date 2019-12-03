export const types = {
  OPEN: 'qry/modal/OPEN',
  CLOSE: 'qry/modal/CLOSE',
  PENDING: 'qry/modal/PENDING',
  ERROR: 'qry/modal/ERROR',
  VALIDATED: 'qry/modal/VALIDATED'
}

const initialState = {
  instance: null,
  error: null,
  pending: false,
  validated: false
}

export const modalConstants = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgotPassword',
  CHANGE_PASSWORD: 'changePassword'
}

export default function modalReducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.OPEN: {
      return {
        ...initialState,
        instance: action.payload
      }
    }
    case types.CLOSE: {
      return {
        ...initialState
      }
    }
    case types.PENDING: {
      return {
        ...state,
        pending: action.payload,
        error: null,
        validated: false
      }
    }
    case types.ERROR: {
      return {
        ...state,
        pending: false,
        error: action.payload,
        validated: false
      }
    }
    case types.VALIDATED: {
      return {
        ...state,
        pending: false,
        error: null,
        validated: true
      }
    }
    default:
      return state
  }
}

export const actions = {
  open: (modal) => ({type: types.OPEN, payload: modal}),
  close: () => ({type: types.CLOSE})
}

export const messages = {
  setPending: (isPending) => ({type: types.PENDING, payload: isPending}),
  setError: (error) => ({type: types.ERROR, payload: error}),
  setValid: () => ({type: types.VALIDATED})
}

export const selectors = {
  instance: (state) => state.modal.instance,
  isPending: (state) => state.modal.pending,
  error: (state) => state.modal.error,
  validated: (state) => state.modal.validated
}