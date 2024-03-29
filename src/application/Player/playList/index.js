import React, {useRef, useState, useCallback} from 'react'
import {connect} from "react-redux"
import { 
  changeShowPlayList, 
  changeCurrentIndex, 
  changePlayMode, 
  changePlayList ,
  deleteSong,
  resetPlayer
} from '../store/actionCreators'
import { PlayListWrapper, ScrollWrapper, ListHeader, ListContent } from './style'
import {prefixStyle, getName, shuffle, findIndex, getValueOfTransform} from '../../../api/utils'
import {playMode, listBoxTouchMoveDistance} from '../../../api/config'
import Scroll from '../../../baseUI/scroll'
import { CSSTransition } from 'react-transition-group'
import Confirm from './../../../baseUI/confirm'


function PlayList (props) {
  const {
    showPlayList,
    currentIndex,
    currentSong,
    playList,
    mode,
    sequencePlayList,
    isPersonalFm
  } = props
  const {
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changeModeDispatch,
    changePlayListDispatch,
    deleteSongDispatch,
    clearDispatch,
    handlePreSongClear
  } = props
  const transform = prefixStyle("transform")

  const playListRef = useRef()
  const listWrapperRef = useRef()
  const confirmRef = useRef()
  const listContentRef = useRef()
  const contentRef = useRef()

  const [isShow, setIsShow] = useState(false)
  const canTouch = useRef(false)

  const [startY, setStartY] = useState(0)
  const [initiated, setInitiated] = useState(false)
  const distanceRef = useRef(0)
  const clickToggle = useRef(true)

  const onEnterCB = useCallback(() => {
    setIsShow(true)
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`
  }, [transform])

  const onEnteringCB = useCallback(() => {
    listWrapperRef.current.style["transition"] = `all 0.3s`
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`
  }, [transform])

  const onExitingCB = useCallback(() => {
    listWrapperRef.current.style["transition"] = `all 0.3s`
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`
  }, [transform])

  const onExitedCB = useCallback(() => {
    setIsShow(false)
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`
  }, [transform])


  const getCurrentIcon = item => {
    const current = currentSong.id === item.id
    const className = current ? 'icon-play' : ''
    const content = current ? '&#xe612;' : ''
    return (
      <i className={`current iconfont ${className}`} dangerouslySetInnerHTML={{__html: content}}></i>
    )
  }

  const getPlayMode = () => {
    let content, text
    if (mode === playMode.sequence) {
      content = "&#xe60e;";
      text = "顺序播放";
    } else if (mode === playMode.loop) {
      content = "&#xe60b;";
      text = "单曲循环";
    } else {
      content = "&#xe611;";
      text = "随机播放";
    }
    return (
      <div>
        <i className="iconfont" onClick={e => changeMode(e)} dangerouslySetInnerHTML={{__html: content}}></i>
        <span className="text" onClick={e => changeMode(e)}>{text}</span>
      </div>
    )
  }

  const handleChangeCurrentIndex = index => {
    if(initiated || currentIndex === index || clickToggle.current === false) return
    
    changeCurrentIndexDispatch(index)
  }

  const handleDeleteSong = (e, song) => {
    e.stopPropagation()
    deleteSongDispatch(song)
  }

  const handleShowClear = () => {
    confirmRef.current.show()
  }

  const handleConfirmClear = () => {
    clearDispatch()
    handlePreSongClear()
  }

  const changeMode = () => {
    let newMode = (mode + 1) % 3
    let index
    switch(newMode) {
      case 0:
        changePlayListDispatch(sequencePlayList)
        index = findIndex(currentSong, sequencePlayList)
        changeCurrentIndexDispatch(index)
        break
      case 1:
        changePlayListDispatch(sequencePlayList)
        break
      case 2:
        let newList = shuffle(sequencePlayList)
        index = findIndex(currentSong, newList)
        changePlayListDispatch(newList)
        changeCurrentIndexDispatch(index)
        break
      default:
    }
    changeModeDispatch(newMode)
  }

  const handleTouchStart = e => {
    if(isPersonalFm || (!canTouch.current && initiated)) return

    let str = contentRef.current.style[transform]
    let y = getValueOfTransform(str, 'y') || 0

    listWrapperRef.current.style["transition"] = ""
    setStartY(e.nativeEvent.touches[0].pageY + y)
    setInitiated(true)
  }
  const handleTouchMove = e => {
    if(isPersonalFm || !canTouch.current || !initiated) return
    
    let distance = e.nativeEvent.touches[0].pageY - startY
    clickToggle.current = false
    if(distance < 0) {
      listContentRef.current.enable()
      return
    }
    
    if(distance > 0) {
      listContentRef.current.disable()
    }
    distanceRef.current = distance
    listWrapperRef.current.style[transform] = `translate3d(0, ${distance}px, 0)`
  }
  const handleTouchEnd = e => {
    if(isPersonalFm) return
    setInitiated(false)

    setTimeout(() => {
      clickToggle.current = true
    });
    listContentRef.current.enable()
    if(distanceRef.current >= listBoxTouchMoveDistance[0]) {
      togglePlayListDispatch(false)
      distanceRef.current = 0
    } else {
      listWrapperRef.current.style["transition"] = "all 0.3s"
      listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`
    }
  }

  const handleScroll = (pos) => {
    let state = (pos.y === 0 )
    canTouch.current = state
  }

  return (
    <CSSTransition
      in={showPlayList}
      timeout={300}
      mountOnEnter
      classNames="list-fade"
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
    >
      <PlayListWrapper
        ref={playListRef}
        style={isShow ? {display: "block"} : {display: "none"}}
        onClick={() => {
          togglePlayListDispatch(false)
        }}
      >
        <div 
          className="list_wrapper" 
          ref={listWrapperRef} 
          onClick={e => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          >
          <ListHeader>
            {
              !isPersonalFm ? 
              <h1 className="title">
                {getPlayMode()}
                <span className="iconfont clear btn-to-deep" onClick={handleShowClear}>&#xe617;</span>
              </h1> : null
            }
          </ListHeader>
          <ScrollWrapper>
            {
              !isPersonalFm ? 
              <Scroll 
                ref={listContentRef}  
                onScroll={pos => handleScroll(pos)}
                bounceTop={false}
                bounceBottom={false}
              >
                <ListContent ref={contentRef}>
                  {
                    playList.map((item, index) => {
                      return (
                        <li className="item btn-to-deep" key={item.id} onClick={() => handleChangeCurrentIndex(index)}>
                          {getCurrentIcon (item)}
                          <span className="text">{item.name} - {getName(item.ar)}</span>
                          <span className="delete btn-to-deep" onClick={e => handleDeleteSong(e, item)}>
                            <i className="iconfont">&#xe61a;</i>
                          </span>
                        </li>
                      )
                    })
                  }
                </ListContent>
              </Scroll> : 
              <div className="personal-fm-wrapper">
                <p className="personal-fm-title">当前播放: 私人FM</p>
                <p className="personal-fm-detail">
                  <span className="personal-fm-song-name">{currentSong.name} </span>
                  - 
                  <span className="personal-fm-song-artist"> {getName(currentSong.artists)}</span>
                </p>
              </div>
            }
          </ScrollWrapper>
        </div>
        <Confirm 
          ref={confirmRef}
          text={"是否删除全部？"}
          cancelBtnText={"取消"}
          confirmBtnText={"确定"}
          handleConfirm={handleConfirmClear}
        />
      </PlayListWrapper>
    </CSSTransition>
    
  )
}

const mapStateToProps = state => ({
  ...state['player'],
  userLikelist: state['user']['userLikelist']
})

const mapDispatchToProps = dispatch => ({
  togglePlayListDispatch(data) {
    dispatch(changeShowPlayList(data))
  },
  changeCurrentIndexDispatch(data) {
    dispatch(changeCurrentIndex(data))
  },
  changeModeDispatch(data) {
    dispatch(changePlayMode(data))
  },
  changePlayListDispatch(data) {
    dispatch(changePlayList(data))
  },
  deleteSongDispatch(data) {
    dispatch(deleteSong(data))
  },
  clearDispatch() {
    dispatch(resetPlayer())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PlayList))