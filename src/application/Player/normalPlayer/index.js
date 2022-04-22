import React, { useRef, useEffect, useState } from 'react'
import {getName, prefixStyle, formatPlayTime, getCountv2} from '../../../api/utils'
import {
  NormalPlayerContainer,
  Top,
  Middle,
  Bottom,
  Operators,
  CDWrapper,
  ProgressWrapper,
  LyricContainer,
  LyricWrapper,
  MoreOperators
} from './style'
import { CSSTransition } from 'react-transition-group'
import animations from 'create-keyframe-animation'
import ProgressBar from '../../../baseUI/progress-bar'
import { playMode } from '../../../api/config'
import Scroll from '../../../baseUI/scroll'
import Marquee from '../../../baseUI/Marquee'

function NormalPlayer(props) {
  const {
    song, 
    isFavorite,
    fullScreen, 
    playing, 
    currentTime, 
    duration, 
    percent, 
    mode,
    totalCount,
    isPersonalFm
  } = props
  const {
    toggleFullScreen, 
    toggleCommentsList,
    getCommentsCount,
    clickPlaying, 
    onProgressChange,
    handlePrev, 
    handleNext, 
    changeMode,
    togglePlayList,
    currentLyric,
    currentPlayingLyric,
    currentLineNum,
    likeMusic,
    collectMusic,
    handleJumpToSingerPage
  } = props

  const normalPlayerRef = useRef()
  const cdWrapperRef = useRef()

  const [currentState, setCurrentState] = useState("")
  const lyricScrollRef = useRef()
  const lyricLineRefs = useRef([])

  const transform = prefixStyle("transform")

  useEffect(() => {
    getCommentsCount(song.id)
  }, [song])

  useEffect(() => {
    if(!lyricScrollRef.current) return
    let bScroll = lyricScrollRef.current.getBScroll()
    if(currentLineNum > 5) {
      let lineEl = lyricLineRefs.current[currentLineNum - 5].current
      bScroll && bScroll.scrollToElement(lineEl, 1000)
    } else {
      bScroll && bScroll.scrollTo(0, 0, 1000)
    }
  }, [currentLineNum])

  const _getPosAndScale = () => {
    const targetWidth = 40
    const paddingLeft = 40
    const paddingBottom = 30
    const clip = 30
    const paddingTop = 80
    const width = window.innerWidth * 0.8
    const scale = targetWidth / width
    const x = -(window.innerWidth / 2 - paddingLeft)
    const y = window.innerHeight - paddingTop - clip - width /2 - paddingBottom
    return {
      x, y, scale
    }
  }

  const enter = () => {
    normalPlayerRef.current.style.display = "block"
    const {x, y, scale} = _getPosAndScale()
    let animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      60: {
        transform: `translate3d(0, 0, 0) scale(1.1)`
      },
      100: {
        transform: `translate3d(0, 0, 0) scale(1)`
      }
    }

    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 400,
        easing: 'linear'
      }
    })

    animations.runAnimation(cdWrapperRef.current, 'move')
  }

  const afterEnter = () => {
    animations.unregisterAnimation('move')
    cdWrapperRef.current.style.animation = ""
  }

  const leave = () => {
    if (!cdWrapperRef.current) return
    const cdWrapperDom = cdWrapperRef.current
    cdWrapperDom.style.transition = "all 0.4s"
    const { x, y, scale } = _getPosAndScale()
    cdWrapperDom.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
  }

  const afterLeave = () => {
    if (!cdWrapperRef.current) return
    const cdWrapperDom = cdWrapperRef.current
    cdWrapperDom.style.transition = ""
    cdWrapperDom.style[transform] = ""
    normalPlayerRef.current.style.display = "none"
  };

  const getPlayMode = () => {
    let content
    if(mode === playMode.sequence) {
      content = "&#xe60e;"
    } else if (mode === playMode.loop) {
      content = "&#xe60b;";
    } else {
      content = "&#xe611;";
    }
    return content
  }

  const handleLikeMusic = () => {
    if(isFavorite) {
      likeMusic(song.id, false)
    } else {
      likeMusic(song.id, true)
    }
  }

  const toggleCurrentState = () => {
    if(currentState !== "lyric") {
      setCurrentState("lyric")
    } else {
      setCurrentState("")
    }
  }

  return (
    <CSSTransition
      classNames="normal"
      in={fullScreen}
      timeout={400}
      mountOnEnter
      onEnter={enter}
      onEntered={afterEnter}
      onExit={leave}
      onExited={afterLeave}
    >
      <NormalPlayerContainer ref={normalPlayerRef}>
        <div className="background">
          <img
            src={isPersonalFm ? song.album.picUrl + "?param=300x300" : song.al.picUrl + "?param=300x300"}
            width="100%"
            height="100%"
            alt="歌曲图片"
          />
        </div>
        <div className="background layer"></div>
        <Top className="top">
          <div className="back" onClick={() => toggleFullScreen(false)}>
            <i className="iconfont icon-back">&#xe604;</i>
          </div>
          <Marquee
            width="70%"
            lineHeight="40px"
            fontSize="l"
            color="main"
            txt={song.name}
            active={fullScreen}
          />
          {/* <h1 className="title">{song.name}</h1> */}
          <Marquee
            width="80%"
            lineHeight="20px"
            fontSize="m"
            color="sub"
            txt={isPersonalFm ?getName(song.artists) : getName(song.ar)}
            active={fullScreen}
            onClick={handleJumpToSingerPage}
          />
          {/* <h1 className="subtitle">{}</h1> */}
        </Top>
        <Middle ref={cdWrapperRef} onClick={toggleCurrentState}>
          <CSSTransition
            timeout={400}
            classNames="fade"
            in={currentState !== "lyric"}
          >
            <CDWrapper 
              style={{
                visibility: currentState !== "lyric" ? "visible" : "hidden",
                // width: '300px',
                // height: '300px'
              }}
            >
              <div className="cd">
                <img
                  className={`image play ${playing ? "" : "pause"}`}
                  src={isPersonalFm ? song.album.picUrl + "?param=400x400" : song.al.picUrl + "?param=400x400"}
                  alt=""
                />
              </div>
              <p className="playing_lyric">{currentPlayingLyric}</p>
            </CDWrapper>
          </CSSTransition>

          <CSSTransition
            timeout={400}
            classNames="fade"
            in={currentState === "lyric"}
          >
            <LyricContainer>
              <Scroll ref={lyricScrollRef}>
                <LyricWrapper
                  style={{visibility: currentState === "lyric" ? "visible" : "hidden"}}
                  className="lyric_wrapper"
                >
                  {
                    currentLyric ?
                      currentLyric.lines.map((item, index) => {
                        lyricLineRefs.current[index] = React.createRef()
                        return (
                          <p
                            className={`text ${currentLineNum === index ? "current" : ""}`}  
                            key={item + index}
                            ref={lyricLineRefs.current[index]}
                          >
                            {item.txt}
                          </p>
                        )
                      })
                      : <p className="text pure"> 纯音乐，请欣赏。 </p>
                  }
                </LyricWrapper>
              </Scroll>
            </LyricContainer>
          </CSSTransition>
          
        </Middle>
        <Bottom className="bottom">
          <MoreOperators 
            style={{visibility: currentState === "lyric" ? "hidden" : "visible"}}
            >
            {
              isPersonalFm ? 
              <div className="icon i-left"></div> :
              <div className="icon i-left" onClick={handleLikeMusic}>
                {
                  isFavorite ? 
                  <i className="iconfont i-favorite">&#xe8c3;</i> 
                  : 
                  <i className="iconfont">&#xe8ab;</i>
                }
              </div>
            }
            <div className="icon i-center">
              <i className="iconfont" onClick={() => {
                if(totalCount > 0) {
                  toggleCommentsList(true)
                }
                }}>&#xe607;</i>
              <span className="commentCount">{getCountv2(totalCount)}</span>
            </div>
            <div className="icon i-right">
              <i className="iconfont" onClick={() => collectMusic(song.id)}>&#xe606;</i>
            </div>
          </MoreOperators>
          <ProgressWrapper>
            <span className="time time-l">{formatPlayTime(currentTime)}</span>
            <div className="progress-bar-wrapper">
              <ProgressBar
                percent={percent}
                percentChange={onProgressChange}
              ></ProgressBar>
            </div>
            <div className="time time-r">{formatPlayTime(duration)}</div>
          </ProgressWrapper>
          <Operators>
            <div className="icon i-left" onClick={isPersonalFm ? handleLikeMusic : changeMode}>
              {
                isPersonalFm ? 
                (
                  isFavorite ? 
                  <i className="iconfont i-favorite">&#xe8c3;</i> 
                  : 
                  <i className="iconfont">&#xe8ab;</i>
                ) 
                :
                <i 
                  className="iconfont"
                  dangerouslySetInnerHTML={{__html: getPlayMode()}}
                ></i>
              }
            </div>
            <div className="icon i-left">
              {
                !isPersonalFm ? 
                <i className="iconfont" onClick={handlePrev}>&#xe6d4;</i> :
                null
              }
            </div>
            <div className="icon i-center">
              <i 
                className="iconfont" 
                onClick={e => clickPlaying(e, !playing)}
                dangerouslySetInnerHTML={{
                  __html: playing ? '&#xe609;' : '&#xe612;'
                }}
              ></i>
            </div>
            <div className="icon i-right" >
              <i className="iconfont" onClick={handleNext}>&#xe6d8;</i>
            </div>
            <div className="icon i-right i-list">
              <i className="iconfont" onClick={() => togglePlayList(true)}>&#xe613;</i>
            </div>
          </Operators>
        </Bottom>
      </NormalPlayerContainer>
    </CSSTransition>
    
  )
}

export default React.memo(NormalPlayer)