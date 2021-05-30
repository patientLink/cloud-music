import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import {connect} from 'react-redux'
import {
  changePlayingState,
  changeShowPlayList,
  changeCurrentIndex,
  changeCurrentSong,
  changePlayList,
  changePlayMode,
  changeFullScreen,
} from './store/actionCreators'
import {
  likeMusicAndRefresh
} from '../Login/store/actionCreators'
import {
  getFirstPageCommentsList
} from '../CommentsList/store/actionCreators'
import MiniPlayer from './miniPlayer'
import NormalPlayer from './normalPlayer'
import {getSongUrl, isEmptyObject, shuffle, findIndex, throttle} from '../../api/utils'
import Toast from '../../baseUI/toast'
import { playMode } from '../../api/config'
import PlayList from './playList'
import {getLyricRequest} from '../../api/request'
import Lyric from '../../api/lyric-parser'

function Player(props) {
  const {
    fullScreen,
    playing,
    currentIndex,
    currentSong,
    mode,
    sequencePlayList,
    playList,
    userLikelist,
    history,
    totalCount
  } = props
  // console.log(props)
  const {
    toggleFullScreenDispatch,
    togglePlayingDispatch,
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changePlayListDispatch,
    changeModeDispatch,
    getCommentsDispatch,
    likeMusicDispatch
  } = props

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const preSong = useRef({})
  const [modeText, setModeText] = useState('')
  const [errorText, setErrorText] = useState('')
  const [currentPlayingLyric, setPlayingLyric] = useState('')

  // console.log('1')
  // let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration
  const percent = useMemo(() => {
    return isNaN(currentTime / duration) ? 0 : currentTime / duration
  }, [currentTime, duration])

  const audioRef = useRef()
  const toastRef = useRef()
  const errToastRef = useRef()
  const songReady = useRef(true)

  const currentLyric = useRef()
  const [currentLineNum, setCurrentLineNum] = useState(0)

  let isFavorite = useMemo(() => {
    if(userLikelist.find(el => currentSong.id === el)) {
      return true
    } else {
      return false
    }
  }, [userLikelist, currentSong])

  

  useEffect(() => {
    if(
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.current.id ||
      !songReady.current || 
      mode === 1
    ) return
    let current = playList[currentIndex]
    changeCurrentDispatch(current)
    preSong.current = current
    songReady.current = false
    audioRef.current.src = getSongUrl(current.id)
    audioRef.current.autoplay = true
    togglePlayingDispatch(true)
    // console.log('reset')
    // console.log(currentTime)
    getLyric(current.id)
    setCurrentTime(0)
    audioRef.current.currentTime = 0
    setDuration((current.dt / 1000) | 0)
  }, [playList, currentIndex])

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause()
  }, [playing])

  const handleToggleCommentsList = () => {
    toggleFullScreenDispatch(false)
    props.history.push(`/comments/${currentSong.id}+0`)
  }

  const handleLyric = ({lineNum, txt}) => {
    // console.log(currentLyric.current)
    if(!currentLyric.current) return
    setCurrentLineNum(lineNum)
    setPlayingLyric(txt)
  }

  const getLyric = id => {
    let lyric = ""
    if(currentLyric.current) {
      // console.log(currentLyric.current)
      currentLyric.current.stop()
      
    }
    setTimeout(() => {
      songReady.current = true
    }, 500);
    getLyricRequest(id)
    .then(data => {
      // console.log(data)
      lyric = data.lrc && data.lrc.lyric
      if(!lyric) {
        currentLyric.current = null
        return
      }
      currentLyric.current = new Lyric(lyric, handleLyric)
      currentLyric.current.play()
      setCurrentLineNum(0)
      
      currentLyric.current.seek(0)
    })
    .catch(() => {
      currentLyric.current = null
      songReady.current = true
      audioRef.current.play()
    })
    .finally(() => {
      setPlayingLyric('')
    })
  }

  const handleError = (err) => {
    console.log(err)
    console.log(audioRef.current)
    songReady.current = true
    togglePlayingDispatch(false)
    currentLyric.current && currentLyric.current.stop()
    setErrorText('歌曲未被授权播放') 
    errToastRef.current.show()
    // alert("播放出错")
  }

  const handlePreSongClear = () => {
    preSong.current = {}
  }

  const clickPlaying = (e, state) => {
    e.stopPropagation()
    if(currentSong && currentSong.privilege && currentSong.privilege.fee === 1) {
      // 需要vip权限
      errToastRef.current.show()
      return
    }
    togglePlayingDispatch(state)
    if(currentLyric.current) {
      currentLyric.current.togglePlay(currentTime * 1000)
    }
  }

  const updateTimeThrottle = useCallback(
    throttle(function(e){
      if(e && e.target && e.target.currentTime) {
        setCurrentTime(e.target.currentTime)
      }
    }, 300) 
  , [currentSong]) 

  const updateTime = (e) => {
    e.persist()
    updateTimeThrottle(e)
  }

  const onProgressChange = curPercent => {
    const newTime = curPercent * duration
    setCurrentTime(newTime)
    audioRef.current.currentTime = newTime
    // if(!playing) {
    //   togglePlayingDispatch(true)
    // }
    if(currentLyric.current) {
      currentLyric.current.seek(newTime * 1000)
      if(!playing) currentLyric.current.stop()
    }
  }

  const handleEnd = () => {
    togglePlayingDispatch(false)
    if(mode === playMode.loop) {
      handleLoop()
    } else {
      handleNext()
    }
  }

  const handleLoop = () => {
    audioRef.current.currentTime = 0
    // currentLyric.current.stop()
    // togglePlayingDispatch(false)
    togglePlayingDispatch(true)
    setCurrentLineNum(0)
    setPlayingLyric('')
    currentLyric.current.seek(0)
    audioRef.current.play()
  }

  const handlePrev = () => {
    if(playList.length === 1 || mode === 1) {
      handleLoop()
      return 
    }
    let index = currentIndex - 1
    if(index < 0) index = playList.length - 1
    if(!playing) togglePlayingDispatch(true)
    changeCurrentIndexDispatch(index)
  }

  const handleNext = () => {
    if(playList.length === 1 || mode === 1) {
      handleLoop()
      return 
    }
    let index = currentIndex + 1
    if(index === playList.length) index = 0
    if(!playing) togglePlayingDispatch(true)
    changeCurrentIndexDispatch(index)
  }

  const changeMode = () => {
    let newMode = (mode + 1) % 3
    let index
    switch(newMode) {
      case 0:
        changePlayListDispatch(sequencePlayList)
        index = findIndex(currentSong, sequencePlayList)
        changeCurrentIndexDispatch(index)
        setModeText("顺序循环")
        break
      case 1:
        changePlayListDispatch(sequencePlayList)
        setModeText("单曲循环")
        break
      case 2:
        let newList = shuffle(sequencePlayList)
        index = findIndex(currentSong, newList)
        changePlayListDispatch(newList)
        changeCurrentIndexDispatch(index)
        setModeText("随机播放")
    }
    changeModeDispatch(newMode)
    toastRef.current.show()
  }

  

  return (
    <div>
      {
        isEmptyObject(currentSong) ? null :
        <MiniPlayer 
          song={currentSong} 
          fullScreen={fullScreen}
          toggleFullScreen={toggleFullScreenDispatch}
          playing={playing}
          clickPlaying={clickPlaying}
          percent={percent}
          togglePlayList={togglePlayListDispatch}
          history={history}
        /> 
      }
      {
        isEmptyObject(currentSong) ? null :
        <NormalPlayer 
          song={currentSong} 
          isFavorite={isFavorite}
          fullScreen={fullScreen}
          getCommentsCount={getCommentsDispatch}
          toggleCommentsList={handleToggleCommentsList}
          toggleFullScreen={toggleFullScreenDispatch}
          togglePlayList={togglePlayListDispatch}
          likeMusic={likeMusicDispatch}
          totalCount={totalCount}
          playing={playing}
          clickPlaying={clickPlaying}
          duration={duration}
          currentTime={currentTime}
          percent={percent}
          onProgressChange={onProgressChange}
          handlePrev={handlePrev}
          handleNext={handleNext}
          mode={mode}
          changeMode={changeMode}
          currentLyric={currentLyric.current}
          currentPlayingLyric={currentPlayingLyric}
          currentLineNum={currentLineNum}
        /> 
      }
      <audio ref={audioRef} onTimeUpdate={updateTime} onEnded={handleEnd} onError={handleError} autoPlay={false}></audio>
      <Toast text={modeText} ref={toastRef}></Toast>
      <Toast text={errorText} ref={errToastRef} raise={true}></Toast>
      <PlayList handlePreSongClear={handlePreSongClear}></PlayList>
      {/* <CommentsList 
        enterLoading={enterLoading} 
        pullUpLoading={pullUpLoading}
        commentsList={commentsList} 
        updateCommentsList={updateCommentsList}
        loadMoreCommentsList={loadMoreCommentsList}
        toggleFullScreen={toggleFullScreenDispatch}
        >
      </CommentsList> */}
    </div>
  )
}

const mapStateToProps = state => ({
  userLikelist: state['user']['userLikelist'],
  totalCount: state['comments']['totalCount'],
  ...state['player']
})

const mapDispatchToProps = dispatch => ({
  togglePlayingDispatch(data) {
    dispatch(changePlayingState(data));
  },
  toggleFullScreenDispatch(data) {
    dispatch(changeFullScreen(data));
  },
  togglePlayListDispatch(data) {
    dispatch(changeShowPlayList(data));
  },
  changeCurrentIndexDispatch(index) {
    dispatch(changeCurrentIndex(index));
  },
  changeCurrentDispatch(data) {
    dispatch(changeCurrentSong(data));
  },
  changeModeDispatch(data) {
    dispatch(changePlayMode(data));
  },
  changePlayListDispatch(data) {
    dispatch(changePlayList(data));
  },
  getCommentsDispatch(id) {
    dispatch(getFirstPageCommentsList(id, 0, 99))
  },
  likeMusicDispatch(id, like) {
    dispatch(likeMusicAndRefresh(id, like))
      
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player))