import {
  getHotSingerListRequest,
  getSingerListRequest
} from '../../../api/request'
import * as actionTypes from './constants'

export const changeSingerList = data => ({
  type: actionTypes.CHANGE_SINGER_LIST,
  data
})
export const changePageCount = data => ({
  type: actionTypes.CHANGE_PAGE_COUNT,
  data
})
export const changeEnterLoading = data => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data
})
export const changePullUpLoading = data => ({
  type: actionTypes.CHANGE_PULLUP_LOADING,
  data
})
export const changePullDownLoading = data => ({
  type: actionTypes.CHANGE_PULLDOWN_LOADING,
  data
})

export const getHotSingerList = () => {
  return (dispatch) => {
    getHotSingerListRequest(0).then(res => {
      const data = res.artists
      dispatch(changeSingerList(data))
      dispatch(changeEnterLoading(false))
      dispatch(changePullDownLoading(false))
    }).catch(() => {
      console.log('热门歌手数据获取失败')
    })
  }
}

export const refreshMoreHotSingerList = () => {
  return (dispatch, getState) => {
    const {pageCount, singerList} = getState()['singers']
    getHotSingerListRequest(pageCount).then(res => {
      const data = [...singerList, ...res.artists]
      dispatch(changeSingerList(data))
      dispatch(changePullUpLoading(false))
    }).catch(() => {
      console.log('热门歌手数据获取失败')
    })
  }
}

export const getSingerList = (type, area, alpha) => {
  return (dispatch, getState) => {
    getSingerListRequest(type, area, alpha, 0).then(res => {
      const data = res.artists
      dispatch(changeSingerList(data))
      dispatch(changeEnterLoading(false))
      dispatch(changePullDownLoading(false))
    }).catch(() => {
      console.log('歌手数据获取失败')
    })
  }
}

export const refreshMoreSingerList = (type, area, alpha) => {
  return (dispatch, getState) => {
    const {pageCount, singerList} = getState()['singers']
    getSingerListRequest(type, area, alpha, pageCount).then(res => {
      const data = [...singerList, ...res.artists]
      dispatch(changeSingerList(data))
      dispatch(changePullUpLoading(false))
    }).catch(() => {
      console.log('歌手数据获取失败')
    })
  }
}