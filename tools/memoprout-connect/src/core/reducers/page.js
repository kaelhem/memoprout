export const types = {
  PENDING: 'qry/page/PENDING',
  ERROR: 'qry/page/ERROR',
  VALIDATED: 'qry/page/VALIDATED'
}

const initialState = {
  error: null,
  pending: false,
  validated: false,
  data: null
}

export default function pageReducer(state = initialState, action = {}) {
  switch (action.type) {
    case '@@router/LOCATION_CHANGED': {
      return {
        ...initialState
      }
    }
    case types.PENDING: {
      return {
        ...initialState,
        pending: action.payload
      }
    }
    case types.ERROR: {
      return {
        ...initialState,
        error: action.payload
      }
    }
    case types.VALIDATED: {
      return {
        pending: false,
        error: null,
        validated: true,
        data: action.payload
      }
    }
    default:
      return state
  }
}

export const messages = {
  setPending: (isPending) => ({type: types.PENDING, payload: isPending}),
  setError: (error) => ({type: types.ERROR, payload: error}),
  setValid: (data) => ({type: types.VALIDATED, payload: data})
}

export const selectors = {
  isPending: (state) => state.page.pending,
  error: (state) => state.page.error,
  validated: (state) => state.page.validated,
  data: (state) => state.page.data
}