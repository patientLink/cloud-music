import * as actionTypes from './constants'
import produce from 'immer'


const defaultState = {
  id: 0,
  list: [],
  loading: false,
  type: 1, // 1: 关注(follow), 2: 粉丝(followed)
  page: 0,
  lasttime: -1, // (粉丝列表)上一次返回结果中最后一位的time值, 以获得下一页的数据
  more: false
}

export default (state=defaultState, action) => {
  let producer = prop => {
    return produce(draft => {draft[prop] = action.data})(state)
  }
  switch(action.type) {
    case actionTypes.RESET_FOLLOW:
      return {...defaultState}
    case actionTypes.SET_FOLLOW_ID:
      return producer('id')
    case actionTypes.SET_FOLLOW_LIST:
      return producer('list')
    case actionTypes.CHANGE_LOADING:
      return producer('loading')
    case actionTypes.SET_FOLLOW_TYPE:
      return producer('type')
    case actionTypes.CHANGE_FOLLOW_PAGE:
      return producer('page')
    case actionTypes.SET_LASTTIME:
      return producer('lasttime')
    case actionTypes.SET_FOLLOW_ISMORE:
      return producer('more')
    default:
      return state
  }
}
