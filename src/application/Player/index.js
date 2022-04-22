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
  changeSequencePlayList,
  changeFmMode,
} from './store/actionCreators'
import {
  likeMusicAndRefresh
} from '../Login/store/actionCreators'
import {
  getFirstPageCommentsList
} from '../CommentsList/store/actionCreators'
import MiniPlayer from './miniPlayer'
import NormalPlayer from './normalPlayer'
import {
  getSongUrl,
  isEmptyObject,
  shuffle,
  findIndex,
  throttle
} from '../../api/utils'
import Toast from '../../baseUI/toast'
import { playMode } from '../../api/config'
import PlayList from './playList'
import {
  getLyricRequest,
  getPersonalFm
} from '../../api/request'
import Lyric from '../../api/lyric-parser'
import {
  changeOperationListShow,
  changeOperationType,
  changeOperationSongId,
  operateChooseSinger
} from '../../components/OperationsList/store/actionCreators'

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
    totalCount,
    isPersonalFm
  } = props
  const {
    toggleFullScreenDispatch,
    togglePlayingDispatch,
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changePlayListDispatch,
    changeModeDispatch,
    changeFmModeDispatch,
    changeSequencePlayListDispatch,
    getCommentsDispatch,
    likeMusicDispatch,
    collectMusicToAlbumDispatch,
    operateChooseSingerDispatch
  } = props

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const preSong = useRef({})
  const [modeText, setModeText] = useState('')
  const [errorText, setErrorText] = useState('')
  const [currentPlayingLyric, setPlayingLyric] = useState('')

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
    if(!playList.length) preSong.current = {}
  }, [playList])

  useEffect(() => {
    if(
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.current.id ||
      !songReady.current || 
      mode === 1
    ) return
    const getLyric = id => {
      let lyric = ""
      if(currentLyric.current) {
        currentLyric.current.stop()
      }
      setTimeout(() => {
        songReady.current = true
      }, 500);
      getLyricRequest(id)
      .then(data => {
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
    let current = playList[currentIndex]
    changeCurrentDispatch(current)
    preSong.current = current
    songReady.current = false
    audioRef.current.src = getSongUrl(current.id)
    audioRef.current.autoplay = true
    togglePlayingDispatch(true)
    getLyric(current.id)
    setCurrentTime(0)
    audioRef.current.currentTime = 0
    setDuration((isPersonalFm ? (current.duration / 1000) : (current.dt / 1000)) | 0)
  }, [playList, currentIndex])

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause()
  }, [playing])

  const handleLoadFmSongs = () => {
    getPersonalFm()
    .then(res => {
      if(res.code === 200) {
        preSong.current = {}
        changePlayListDispatch(res.data)
        changeSequencePlayListDispatch(res.data)
        changeFmModeDispatch(true)
        changeModeDispatch(playMode.sequence)
        changeCurrentIndexDispatch(0)
      }
    })
  }

  const handleToggleCommentsList = () => {
    toggleFullScreenDispatch(false)
    props.history.push(`/comments/${currentSong.id}+0`)
  }

  const handleJumpToSingerPage = () => {
    toggleFullScreenDispatch(false)
    if(isPersonalFm) {
      if(currentSong.artists.length === 1) {
        props.history.push(`/singers/${currentSong.artists[0].id}`)
      } else {
        operateChooseSingerDispatch(currentSong.artists)
      }
    } else {
      if(currentSong.ar.length === 1) {
        props.history.push(`/singers/${currentSong.ar[0].id}`)
      } else {
        operateChooseSingerDispatch(currentSong.ar)
      }
    }
  }

  const handleLyric = ({lineNum, txt}) => {
    if(!currentLyric.current) return
    setCurrentLineNum(lineNum)
    setPlayingLyric(txt)
  }
  const handleError = (err) => {
    console.log(err)
    songReady.current = true
    togglePlayingDispatch(false)
    currentLyric.current && currentLyric.current.stop()
    if(currentSong.fee !== 0) {
      setErrorText('歌曲未被授权播放')
    } else {
      setErrorText('该资源暂时无法收听') 
    }
    errToastRef.current.show()
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
    if(isPersonalFm && currentIndex === playList.length-1) {
      console.log('加载更多私人fm歌曲')
      changeCurrentIndexDispatch(-1)
      handleLoadFmSongs()
      return
    }
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
        break
      default:
    }
    changeModeDispatch(newMode)
    toastRef.current.show()
  }
  return (
    <div>
      {
        isEmptyObject(currentSong) ? null :
        <>
          <MiniPlayer 
            song={currentSong} 
            fullScreen={fullScreen}
            toggleFullScreen={toggleFullScreenDispatch}
            playing={playing}
            clickPlaying={clickPlaying}
            percent={percent}
            togglePlayList={togglePlayListDispatch}
            isPersonalFm={isPersonalFm}
          /> 
          <NormalPlayer 
            song={currentSong} 
            isFavorite={isFavorite}
            isPersonalFm={isPersonalFm}
            fullScreen={fullScreen}
            getCommentsCount={getCommentsDispatch}
            toggleCommentsList={handleToggleCommentsList}
            toggleFullScreen={toggleFullScreenDispatch}
            togglePlayList={togglePlayListDispatch}
            likeMusic={likeMusicDispatch}
            collectMusic={collectMusicToAlbumDispatch}
            handleJumpToSingerPage={handleJumpToSingerPage}
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
          <PlayList handlePreSongClear={handlePreSongClear}></PlayList>
        </>
      }
      <audio ref={audioRef} onTimeUpdate={updateTime} onEnded={handleEnd} onError={handleError} autoPlay={false}></audio>
      <Toast text={modeText} ref={toastRef}></Toast>
      <Toast text={errorText} ref={errToastRef} raise={true}></Toast>
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
  changeSequencePlayListDispatch(data) {
    dispatch(changeSequencePlayList(data))
  },
  changeFmModeDispatch(data) {
    dispatch(changeFmMode(data))
  },
  getCommentsDispatch(id) {
    dispatch(getFirstPageCommentsList(id, 0, 99))
  },
  likeMusicDispatch(id, like) {
    dispatch(likeMusicAndRefresh(id, like))
  },
  collectMusicToAlbumDispatch(id) {
    dispatch(changeOperationSongId(id))
    dispatch(changeOperationType(1))
    dispatch(changeOperationListShow(true))
  },
  operateChooseSingerDispatch(data) {
    dispatch(operateChooseSinger(data))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player))