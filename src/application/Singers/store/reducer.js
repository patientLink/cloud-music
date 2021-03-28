import produce from 'immer'
import * as actionTypes from './constants'

const defaultState = {
  singerList: [],
  enterLoading: true,
  pullUpLoading: false,
  pullDownLoading: false,
  pageCount: 0
}

export default (state=defaultState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_SINGER_LIST: 
      return produce(state, draftState => {
        draftState.singerList = action.data
      })
    case actionTypes.CHANGE_ENTER_LOADING: 
      return produce(state, draftState => {
        draftState.enterLoading = action.data
      })
    case actionTypes.CHANGE_PAGE_COUNT: 
      return produce(state, draftState => {
        draftState.pageCount = action.data
      })
    case actionTypes.CHANGE_PULLUP_LOADING:
      return produce(state, draftState => {
        draftState.pullUpLoading = action.data
      })
    case actionTypes.CHANGE_PULLDOWN_LOADING: 
      return produce(state, draftState => {
        draftState.pullDownLoading = action.data
      })
    default:
      return state
  }
}