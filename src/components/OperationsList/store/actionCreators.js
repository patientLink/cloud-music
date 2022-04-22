import * as actionTypes from './constants'
import { getSingerDetailRequest } from '../../../api/request'

export const changeOperationListShow = data => ({
  type: actionTypes.TOGGLE_OPERATION_LIST_SHOW,
  data
})
export const changeOperationType = data => ({
  type: actionTypes.CHANGE_OPERATION_TYPE,
  data
})
export const changeOperationSongId = data => ({
  type: actionTypes.CHANGE_OPERATION_SONG_ID,
  data
})
export const changeOperationSingersList = data => ({
  type: actionTypes.CHANGE_OPERATION_SINGERS_LIST,
  data
})

export const operateSong = (id) => {
  return dispatch => {
    dispatch(changeOperationType(0))
    dispatch(changeOperationSongId(id))
  }
}

export const operateChooseAlbum = () => {
  return dispatch => {
    dispatch(changeOperationListShow(false))
    setTimeout(() => {
      dispatch(changeOperationType(1))
      dispatch(changeOperationListShow(true))
    }, 300)
  }
}

export const operateChooseSinger = (ar) => {
  return dispatch => {
    dispatch(changeOperationListShow(false))
    console.log(ar)
    let arPromises = ar.map(item => {
      return new Promise((resolve, reject) => {
        getSingerDetailRequest(item.id)
        .then(res => {
          if(res.code === 200) {
            resolve(res.data['artist'])
          }
        })
      })
    })
    console.log(arPromises)
    setTimeout(() => {
      dispatch(changeOperationType(2))
      Promise.allSettled(arPromises)
      .then(result => {
        dispatch(changeOperationSingersList(result))
      })
      dispatch(changeOperationListShow(true))
    })
  }
}