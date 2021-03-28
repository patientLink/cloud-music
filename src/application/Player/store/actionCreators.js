import * as actionTypes from './constants'
import {getSongDetailRequest} from '../../../api/request'

export const changeCurrentSong = data => ({
  type: actionTypes.SET_CURRENT_SONG,
  data
})

export const changeFullScreen = data => ({
  type: actionTypes.SET_FULL_SCREEN,
  data
})

export const changePlayingState = data => ({
  type: actionTypes.SET_PLAYING_STATE,
  data
})

export const changeSequencePlayList = data => ({
  type: actionTypes.SET_SEQUECE_PLAYLIST,
  data
})

export const changePlayList = data => ({
  type: actionTypes.SET_PLAYLIST,
  data
})

export const changePlayMode = data => ({
  type: actionTypes.SET_PLAY_MODE,
  data
})

export const changeCurrentIndex = data => ({
  type: actionTypes.SET_CURRENT_INDEX,
  data
})

export const changeShowPlayList = data => ({
  type: actionTypes.SET_SHOW_PLAYLIST,
  data
})

export const changeShowCommentsList = data => ({
  type: actionTypes.SET_SHOW_COMMENTS_LIST,
  data
})

export const deleteSong = data => ({
  type: actionTypes.DELETE_SONG,
  data
})

export const insertSong = data => ({
  type: actionTypes.INSERT_SONG,
  data
})


export const getSongDetail = id => {
  return dispatch => {
    getSongDetailRequest(id).then(data => {
      let song = data.songs[0]
      dispatch(insertSong(song))
    })
  }
}