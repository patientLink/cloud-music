import * as actionTypes from './constants'
import produce from 'immer'
import {playMode} from './../../../api/config'
import { findIndex } from '../../../api/utils'


const defaultState = {
  fullScreen: false, // 全屏模式
  playing: false, // 是否正在播放中
  sequencePlayList: [], // 顺序播放列表
  playList: [], // 播放列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前歌曲在播放列表的索引位置
  showPlayList: false, // 是否展示播放列表,
  showCommentsList: false, // 是否展示评论列表
  currentSong: {} // 当前歌曲
}

const handleDeleteSong = (state, song) => {

  return produce(state, draft => {
    const playList = draft['playList']
    const sequenceList = draft['sequencePlayList']
    let currentIndex = draft['currentIndex']

    const fpIndex = findIndex(song, playList)
    playList.splice(fpIndex, 1)
    if(fpIndex < currentIndex) currentIndex--

    const fsIndex = findIndex(song, sequenceList)
    sequenceList.splice(fsIndex, 1)

    draft['playList'] = playList
    draft['sequencePlayList'] = sequenceList
    draft['currentIndex'] = currentIndex
  })
}

const handleInsertSong = (state, song) => {
  return produce(state, draft => {
    const playList = draft['playList']
    const sequenceList = draft['sequencePlayList']
    let currentIndex = draft['currentIndex']
    let fpIndex = findIndex(song, playList)
    if (fpIndex === currentIndex && currentIndex !== -1) return 
    currentIndex++
    playList.splice(currentIndex, 0, song)
    if(fpIndex > -1) {
      if(currentIndex > fpIndex) {
        playList.splice(fpIndex, 1)
        currentIndex--
      } else {
        playList.splice(fpIndex+1, 1)
      }
    }
    let sequenceIndex = findIndex(playList[currentIndex], sequenceList) + 1
    let fsIndex = findIndex(song, sequenceList)

    sequenceList.splice(sequenceIndex, 0, song)
    if(fsIndex > -1) {
      if(sequenceIndex > fsIndex) {
        sequenceList.splice(fsIndex, 1)
        sequenceIndex--
      } else {
        sequenceList.splice(fsIndex+1, 1)
      }
    }
      draft['playList'] = playList
      draft['sequencePlayList'] = sequenceList
      draft['currentIndex'] = currentIndex
    
  })
  
}

export default (state=defaultState, action) => {
  let producer = (prop) => {
    return produce(draft => {draft[prop] = action.data})(state)
  }
  switch (action.type) {
    case actionTypes.SET_CURRENT_SONG:
      return producer('currentSong')
    case actionTypes.SET_FULL_SCREEN:
      return producer('fullScreen')
    case actionTypes.SET_PLAYING_STATE:
      return producer('playing')
    case actionTypes.SET_SEQUECE_PLAYLIST:
      return producer('sequencePlayList')
    case actionTypes.SET_PLAYLIST:
      return producer('playList')
    case actionTypes.SET_PLAY_MODE:
      return producer('mode')
    case actionTypes.SET_CURRENT_INDEX:
      return producer('currentIndex')
    case actionTypes.SET_SHOW_PLAYLIST:
      return producer('showPlayList')
    case actionTypes.SET_SHOW_COMMENTS_LIST:
      return producer('showCommentsList')
    case actionTypes.DELETE_SONG:
      return handleDeleteSong(state, action.data)
    case actionTypes.INSERT_SONG: 
      return handleInsertSong(state, action.data)
    default:
      return state
  }
}