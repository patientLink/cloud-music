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
    getAlbumDetailRequest(id).then(res => {
      let data = res.playlist
      dispatch(changeCurrentAlbum(data))
      dispatch(changeEnterLoading(false))
    }).catch(() => {
      alert('资源获取失败！')
      console.log('获取album数据失败！')
    })
  }
}