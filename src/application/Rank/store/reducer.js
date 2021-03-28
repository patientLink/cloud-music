import { CHANGE_RANK_LIST, CHANGE_LOADING } from "./constants"
import produce from 'immer'

const defaultState = {
  rankList: [],
  loading: true
}

const reducer = (state=defaultState, action) => {
  switch(action.type) {
    case CHANGE_RANK_LIST: 
      return produce(state, draftState => {
        draftState.rankList = action.data
      })
    case CHANGE_LOADING: 
      return produce(state, draftState => {
        draftState.loading = action.data
      })
    default:
      return state
  }
}

export default reducer