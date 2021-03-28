import * as actionTypes from './constants'
import {getSingerInfoRequest} from '../../../api/request'

const changeArtist = data => ({
  type: actionTypes.CHANGE_ARTIST,
  data
})

const changeSongs = data => ({
  type: actionTypes.CHANGE_SONGS_OF_ARTIST,
  data
})

export const changeEnterLoading = data => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data
})

export const getSingerInfo = id => {
  return dispatch => {
    getSingerInfoRequest(id).then(data => {
      dispatch(changeArtist(data.artist))
      dispatch(changeSongs(data.hotSongs))
      dispatch(changeEnterLoading(false))
    })
  }
}