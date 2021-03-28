import * as actionTypes from './constants'
import produce from 'immer'

const defaultState = {
  bannerList: [],
  recommendList: [],
  enterLoading: true
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case actionTypes.CHANGE_BANNER:
      return produce(state, draftState => {
        draftState.bannerList = action.data
      })
    case actionTypes.CHANGE_RECOMMEND_LIST:
      return produce(state, draftState => {
        draftState.recommendList = action.data
      })
    case actionTypes.CHANGE_ENTER_LOADING: 
      return produce(state, draftState => {
        draftState.enterLoading = action.data
      })
    default:
      return state
  }
}