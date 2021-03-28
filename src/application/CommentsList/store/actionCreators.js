import * as actionTypes from './constants'
import {getCommentRequest} from '../../../api/request'

export const resetCommentsList = () => ({
  type: actionTypes.RESET_COMMENTS,
})

export const changeCommentsList = data => ({
  type: actionTypes.CHANGE_COMMENTS_LIST,
  data
})

export const loadMoreCommentsList = data => ({
  type: actionTypes.LOAD_MORE_COMMENTS_LIST,
  data
})

export const changeCommentsTotalCount = data => ({
  type: actionTypes.CHANGE_TOTALCOUNT,
  data
})

export const changeCommentsPage = data => ({
  type: actionTypes.CHANGE_PAGE,
  data
})

export const changeCommentsSortType = data => ({
  type: actionTypes.CHANGE_SORTTYPE,
  data
})

export const changeCommentsCursor = data => ({
  type: actionTypes.CHANGE_CURSOR,
  data
})

export const changeCommentsLoading = data => ({
  type: actionTypes.CHANGE_LOADING,
  data
})

export const toggleShowCommentsList = data => ({
  type: actionTypes.SHOW_COMMENTS_LIST,
  data
})

export const changeCommentsId = data => ({
  type: actionTypes.SET_COMMENTS_ID,
  data
})

export const changeCommentsType = data => ({
  type: actionTypes.SET_COMMENTS_TYPE,
  data
})

export const getFirstPageCommentsList = (id, type, sortType) => {
  return dispatch => {
    dispatch(changeCommentsLoading(true))
    dispatch(changeCommentsId(+id))
    dispatch(changeCommentsType(type))
    sortType = (sortType === 1 || sortType === 99) ? 99 : sortType
    getCommentRequest(id, type, 1, sortType)
    .then(res => {
      if (res.data && res.data.totalCount > 0 && res.data.comments.length > 0) {
        dispatch(changeCommentsList(res.data.comments))
        dispatch(changeCommentsTotalCount(res.data.totalCount))
        dispatch(changeCommentsSortType(sortType))
        dispatch(changeCommentsPage(1))
        dispatch(changeCommentsCursor(res.data.cursor))
      }
    })
    .catch(err => {
      dispatch(resetCommentsList())
    })
    .finally(() => {
      dispatch(changeCommentsLoading(false)) 
    })
  }
}

export const loadMoreComments = (id, type, page, sortType, cursor) => {
  return dispatch => {
    dispatch(changeCommentsLoading(true))
    sortType = (sortType === 1 || sortType === 99) ? 99 : sortType
    getCommentRequest(id, type, page, sortType, cursor)
    .then(res => {
      if (res.data && res.data.totalCount > 0 && res.data.comments.length > 0) {
        dispatch(loadMoreCommentsList(res.data.comments))
        dispatch(changeCommentsTotalCount(res.data.totalCount))
        dispatch(changeCommentsPage(page))
        dispatch(changeCommentsSortType(sortType))
        dispatch(changeCommentsCursor(res.data.cursor))
      }
    })
    .catch(err => {
      dispatch(resetCommentsList())
    })
    .finally(() => {
      dispatch(changeCommentsLoading(false)) 
    })
  }
}

