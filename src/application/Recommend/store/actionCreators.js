import * as actionTypes from './constants'
import {getBannerRequest, getRecommendListRequest} from '../../../api/request'

export const changeBannerList = (data) => ({
  type: actionTypes.CHANGE_BANNER,
  data
})

export const changeRecommendList = (data) => ({
  type: actionTypes.CHANGE_RECOMMEND_LIST,
  data
})

export const changeEnterLoading = (data) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data
})

export const getBannerList = () => {
  return (dispatch) => {
    getBannerRequest()
    .then(data => {
      dispatch(changeBannerList(data.banners))
    })
    .catch((err) => {
      console.log('轮播图数据传输错误 ', err.message)
    })
  }
}

export const getRecommendList = () => {
  return (dispatch) => {
    getRecommendListRequest()
    .then(data => {
      dispatch(changeRecommendList(data.result))
      dispatch(changeEnterLoading(false))
    })
    .catch((err) => {
      console.log('推荐歌单数据传输错误 ',err)
    })
  }
}
