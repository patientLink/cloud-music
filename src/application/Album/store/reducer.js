import produce from 'immer'
import * as actionTypes from './constants'

const defaultState = {
  currentAlbum: [],
  enterLoading: true
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_CURRENT_ALBUM:
      return produce(state, draftState => {
        draftState.currentAlbum = action.data
      })
    case actionTypes.CHANGE_ENTER_LOADING: 
      return produce(state, draftState => {
        draftState.enterLoading = action.data
      })
    default:
      return state
  }
}