import * as actionTypes from './constants'
import {
  getLoginStatusRequest, 
  getUserDetail,
  getUserSubcount,
  getUserLevel,
  logoutRequest,
  getUserLikelist,
  getUserPlaylist,
  getUserArtistslist,
  likeMusic,
  collectAlbum,
  collectArtist
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

const changeUserSublist = data => ({
  type: actionTypes.CHANGE_USER_SUBLIST,
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
    res = res.data
    if(res.code === 200 && res.account && res.profile) {
      console.log('已登录')
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
  getUserArtistslist().then(res => {
    if(res.code === 200) {
      dispatch(changeUserSublist(res.data))
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

export const getUserMorePlayInfos = (id) => dispatch => {
  getUserSubcount().then(res => {
    if(res.code === 200) {
      dispatch(changeUserSubcount(res))
    }
  })
  getUserLikelist(id).then(res => {
    if(res.code === 200) {
      res.ids && dispatch(changeUserLikelist(res.ids))
    }
  })
  getUserArtistslist().then(res => {
    if(res.code === 200) {
      dispatch(changeUserSublist(res.data))
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
    console.log(err.response.data.msg)
    return Promise.reject(err)
  })
}

export const collectAlbumAndRefresh = (t, id) => (dispatch, getState) => {
  const {userId} = getState()['user']
  collectAlbum(t, id)
  .then(res => {
    if(res.code === 200) {
      dispatch(getUserMorePlayInfos(userId))
    }
  })
  .catch(err => {
    console.log(err.response.data.msg)
    return Promise.reject(err)
  }) 
}

export const collectArtistAndRefresh = (t, id) => (dispatch, getState) => {
  const {userId} = getState()['user']
  collectArtist(t, id)
  .then(res => {
    if(res.code === 200) {
      dispatch(getUserMorePlayInfos(userId))
    }
  })
  .catch(err => {
    console.log(err.response.data.msg)
    return Promise.reject(err)
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