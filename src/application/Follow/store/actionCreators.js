import * as actionTypes from './constants'
import {getUserFolloweds, getUserFollows} from '../../../api/request'

export const resetFollowList = () => ({
  type: actionTypes.RESET_FOLLOW
})

export const changeFollowList = data => ({
  type: actionTypes.SET_FOLLOW_LIST,
  data
})

export const changeFollowId = data => ({
  type: actionTypes.SET_FOLLOW_ID,
  data
})

export const changeFollowLoading = data => ({
  type: actionTypes.CHANGE_LOADING,
  data
})

export const changeFollowType = data => ({
  type: actionTypes.SET_FOLLOW_TYPE,
  data
})

export const changeFollowPage = data => ({
  type: actionTypes.CHANGE_FOLLOW_PAGE,
  data
})

export const changeFollowLasttime = data => ({
  type: actionTypes.SET_LASTTIME,
  data
})

export const changeFollowMore = data => ({
  type: actionTypes.SET_FOLLOW_ISMORE,
  data
})

export const getFollowList = id => {
  return (dispatch, getState) => {
    dispatch(changeFollowLoading(true))
    getUserFollows(id, 0)
    .then(res => {
      if(res.code === 200) {
        dispatch(changeFollowList(res.follow))
        dispatch(changeFollowMore(res.more))
        dispatch(changeFollowType(1))
        dispatch(changeFollowPage(0))
        dispatch(changeFollowId(id))
      }
    })
    .finally(() => {
      dispatch(changeFollowLoading(false))
    })
  }
}

export const getFollowedList = id => {
  return (dispatch, getState) => {
    dispatch(changeFollowLoading(true))
    getUserFolloweds(id, -1)
    .then(res => {
      if(res.code === 200) {
        
        let len, time = -1
        if(res.followeds.length > 0) {
          len = res.followeds.length
          time = res.followeds[len-1]['time']
        }
         
        dispatch(changeFollowList(res.followeds))
        dispatch(changeFollowMore(res.more))
        dispatch(changeFollowType(2))
        dispatch(changeFollowLasttime(time))
        dispatch(changeFollowId(id))
      }
    })
    .finally(() => {
      dispatch(changeFollowLoading(false))
    })
  }
}

export const getMoreFollowList = () => {
  return (dispatch, getState) => {
    const {page, more, id, list} = getState()['follow']
    if(more) {
      dispatch(changeFollowLoading(true))
      getUserFollows(id, page+1)
      .then(res => {
        if(res.code === 200) {
          dispatch(changeFollowList([...list, ...res.follow]))
          dispatch(changeFollowPage(page+1))
          dispatch(changeFollowMore(res.more))
        }
      })
      .finally(() => {
        dispatch(changeFollowLoading(false))
      })
    } 
  }
}

export const getMoreFollowedList = () => {
  return (dispatch, getState) => {
    const {lasttime, more, id, list} = getState()['follow']
    if(more) {
      dispatch(changeFollowLoading(true))
      getUserFollows(id, lasttime)
      .then(res => {
        if(res.code === 200) {

          let len, time = -1
          if(res.followeds.length > 0) {
            len = res.followeds.length
            time = res.followeds[len-1]['time']
          }

          dispatch(changeFollowList([...list, ...res.followeds]))
          dispatch(changeFollowLasttime(time === -1 ? lasttime : time))
          dispatch(changeFollowMore(res.more))
        }
      })
      .finally(() => {
        dispatch(changeFollowLoading(false))
      })
    } 
  }
}