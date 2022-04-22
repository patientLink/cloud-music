import * as actionTypes from './constants'
import {getAlbumDetailRequest} from '../../../api/request'

export const changeCurrentAlbum = data => ({
  type: actionTypes.CHANGE_CURRENT_ALBUM,
  data
})

export const changeEnterLoading = data => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data
})

export const getAlbumList = id => {
  return dispatch => {
    dispatch(changeEnterLoading(true))
    getAlbumDetailRequest(id).then(res => {
      let data = res.playlist
      dispatch(changeCurrentAlbum(data))
    }).catch(() => {
      alert('资源获取失败！')
      console.log('获取album数据失败！')
    }).finally(() => {
      dispatch(changeEnterLoading(false))
    })
  }
}

export const updateCurrentAlbum = data => {
  return dispatch => {
    dispatch(changeEnterLoading(true))
    dispatch(changeCurrentAlbum(data))
    dispatch(changeEnterLoading(false))
  }
}