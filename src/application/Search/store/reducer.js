import * as actionTypes from './constants'
import produce from 'immer'

const defaultState = {
  hotList: [],
  suggestList: [],
  songsList: [],
  enterLoading: false
}



export default (state=defaultState, action) => {
  const producer = (prop) => produce(draft => {draft[prop] = action.data})(state)
  switch(action.type) {
    case actionTypes.SET_HOT_KEYWRODS:
      return producer('hotList')
    case actionTypes.SET_SUGGEST_LIST:
      return producer('suggestList')
    case actionTypes.SET_RESULT_SONGS_LIST:
      return producer('songsList')
    case actionTypes.SET_ENTER_LOADING:
      return producer('enterLoading')
    default:
      return state
  }
}