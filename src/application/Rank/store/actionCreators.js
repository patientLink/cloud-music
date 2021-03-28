import { getRankListRequest } from "../../../api/request";

const { CHANGE_RANK_LIST, CHANGE_LOADING } = require("./constants");

const changeRankList = (data) => ({
  type: CHANGE_RANK_LIST,
  data
})

const changeLoading = (data) => ({
  type: CHANGE_LOADING,
  data
})

export const getRankList = () => {
  return dispatch => {
    getRankListRequest().then(data => {
      let list = data && data.list
      dispatch(changeRankList(list))
      dispatch(changeLoading(false))
    })
  }
}