import * as actionTypes from './constants'
import {
  getLoginStatusRequest, 
  phoneLoginRequest,
  getUserDetail,
  getUserSubcount,
  getUserLevel,
  logoutRequest,
  getUserLikelist,
  getUserPlaylist,
  likeMusic
} from '../../../api/request'

export const changeUserId = data => ({
  type: actionTypes.CHANGE_USER_ID,
  data
})

export const changeLoginStatus = data => ({
  type: actionTypes.CHANGE_LOGIN_STATUS,
  data
})

const changeUserDetail = data => ({
  type: actionTypes.CHANGE_USER_DETAIL,
  data
})

const changeUserSubcount = data => ({
  type: actionTypes.CHANGE_USER_SUBCOUNT,
  data
})

const changeUserLevel = data => ({
  type: actionTypes.CHANGE_USER_LEVEL,
  data
})

const changeUserLikelist = data => ({
  type: actionTypes.CHANGE_USER_LIKELIST,
  data
})

const changeUserPlaylist = data => ({
  type: actionTypes.CHANGE_USER_PLAYLIST,
  data
})

export const getLoginStatus = (dispatch) => {
  getLoginStatusRequest()
  .then(res => {
    console.log(res)
    if(res.code === 200) {
      dispatch(changeLoginStatus(true))
      dispatch(changeUserId(res.profile.userId))
    }
  }, err => {
    console.log('未登录')
    dispatch(changeLoginStatus(false))
    dispatch(changeUserId(''))
  })
}

export const getUserMore = (id) => (dispatch) => {
  getUserDetail(id).then(res => {
    if(res.code === 200) {
      res.profile && dispatch(changeUserDetail({...res.profile, listenSongs: res.listenSongs, createDays: res.createDays}))
    }
  })
  getUserSubcount().then(res => {
    if(res.code === 200) {
      dispatch(changeUserSubcount(res))
    }
  })
  getUserLevel().then(res => {
    if(res.code === 200) {
      res.data && dispatch(changeUserLevel(res.data))
    }
  })
  getUserLikelist(id).then(res => {
    if(res.code === 200) {
      res.ids && dispatch(changeUserLikelist(res.ids))
    }
  })
  getUserPlaylist(id).then(res => {
    if(res.code === 200) {
      if(res.playlist && res.playlist.length > 0 ) {
        let list = {
          own: [],
          collect: []
        }
        res.playlist.forEach(item => {
          if(item.creator && item.creator.userId === id) {
            list.own.push(item)
          } else {
            list.collect.push(item)
          }
        })
        dispatch(changeUserPlaylist(list))
      }
    }
  })
}

export const likeMusicAndRefresh = (id, like) => (dispatch, getState) => {
  const {userId} = getState()['user']
  likeMusic(id, like)
  .then(res => {
    if(res.code === 200) {
      getUserLikelist(userId)
      .then(data => {
        if(data.code === 200) {
          data.ids &&  dispatch(changeUserLikelist(data.ids))
        }
      })
    }
  })
  .catch(err => {
    console.log('操作失败')
  })
}

export const clearUser = (dispatch) => {
  logoutRequest().then(res => {
    console.log('已登出')
    dispatch(changeUserId(''))
    dispatch(changeLoginStatus(false))
    dispatch(changeUserDetail({}))
    dispatch(changeUserSubcount({}))
    dispatch(changeUserLevel({}))
    dispatch(changeUserLikelist([]))
    dispatch(changeUserPlaylist({
      own: [],
      collect: []
    }))
  })
  
}