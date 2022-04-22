import produce from 'immer'
import * as actionTypes from './constants'

const defaultState = {
  showOperationList: false,
  operationType: 0, // 0-对选中歌曲进行操作 1-收藏到歌单操作 2-跳转到歌手页操作
  operationSongId: null, // 选中歌曲的id
  operationSingersList: []
}

export default (state = defaultState, action) => {
  let producer = (prop) => produce(draft => {draft[prop] = action.data})(state)
  switch(action.type) {
    case actionTypes.TOGGLE_OPERATION_LIST_SHOW:
      return producer('showOperationList')
    case actionTypes.CHANGE_OPERATION_TYPE:
      return producer('operationType')
    case actionTypes.CHANGE_OPERATION_SONG_ID:
      return producer('operationSongId')
      case actionTypes.CHANGE_OPERATION_SINGERS_LIST:
      return producer('operationSingersList')
    default: 
      return state
  }
}