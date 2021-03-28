import * as actionTypes from './constants'
import produce from 'immer'

const defaultState = {
  list: [],
  totalCount: 0,
  pageNo: 1,
  sortType: 99,
  cursor: '0',
  loading: false,
  showCommentsList: false,
  id: 0,
  type: 0
}

export default (state=defaultState, action) => {
  let producer = (prop) => {
    return produce(draft => {draft[prop] = action.data})(state)
  }
  switch (action.type) {
    case actionTypes.RESET_COMMENTS:
      return {...defaultState}
    case actionTypes.CHANGE_COMMENTS_LIST:
      return producer('list')
    case actionTypes.LOAD_MORE_COMMENTS_LIST:
      return produce(draft => {
        draft['list'] = [...draft['list'], ...action.data]
      })(state)
    case actionTypes.CHANGE_TOTALCOUNT:
      return producer('totalCount')
    case actionTypes.CHANGE_PAGE:
      return producer('pageNo')
    case actionTypes.CHANGE_SORTTYPE:
      return producer('sortType')
    case actionTypes.CHANGE_CURSOR:
      return producer('cursor')
    case actionTypes.CHANGE_LOADING:
      return producer('loading')
    case actionTypes.SHOW_COMMENTS_LIST:
      return producer('showCommentsList')
    case actionTypes.SET_COMMENTS_ID:
      return producer('id')
    case actionTypes.SET_COMMENTS_TYPE:
      return producer('type')
    default:
      return state
  }
}