import * as actionTypes from './constants'
import produce from 'immer'

const defaultState = {
  artist: {},
  songsOfArtist: [],
  loading: true
}

export default (state=defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_ARTIST: 
      return produce(state, draftState => {
        draftState.artist = action.data
      })
    case actionTypes.CHANGE_SONGS_OF_ARTIST:
      return produce(state, draftState => {
        draftState.songsOfArtist = action.data
      })
    case actionTypes.CHANGE_ENTER_LOADING:
      return produce(state, draftState => {
        draftState.loading = action.data
      })
    default: 
      return state
  }
}