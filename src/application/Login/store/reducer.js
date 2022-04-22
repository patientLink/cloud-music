import produce from 'immer'
import * as actionTypes from './constants'

const defaultState = {
  userId: '',
  isLogin: false,
  userDetail: {},
  userSubCount: {},
  userLevel: {},
  userLikelist: [],
  userPlaylist: {
    own: [],
    collect: []
  },
  userSublist: []
}

export default (state = defaultState, action) => {
  let producer = (prop) => produce(draft => {draft[prop] = action.data})(state)
  switch(action.type) {
    case actionTypes.CHANGE_USER_ID:
      return producer('userId')
    case actionTypes.CHANGE_LOGIN_STATUS: 
      return producer('isLogin')
    case actionTypes.CHANGE_USER_DETAIL:
      return producer('userDetail')
    case actionTypes.CHANGE_USER_SUBCOUNT:
      return producer('userSubCount')
    case actionTypes.CHANGE_USER_LEVEL:
      return producer('userLevel')
    case actionTypes.CHANGE_USER_LIKELIST:
      return producer('userLikelist')
    case actionTypes.CHANGE_USER_PLAYLIST:
      return producer('userPlaylist')
    case actionTypes.CHANGE_USER_SUBLIST:
      return producer('userSublist')
    default: 
      return state
  }
}