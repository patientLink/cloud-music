import React, {useRef, useState, useCallback, useEffect} from 'react'
import {connect} from "react-redux"
import { 
  insertNextSong
} from '../../application/Player/store/actionCreators'
import { PlayListWrapper, ScrollWrapper, ListHeader, ListContent, ListItem } from './style'
import {prefixStyle, getValueOfTransform, getName} from '../../api/utils'
import Scroll from '../../baseUI/scroll'
import { CSSTransition } from 'react-transition-group'
import Confirm from '../../baseUI/confirm'
import Toast from '../../baseUI/toast'
import { listBoxTouchMoveDistance } from '../../api/config'
import { 
  changeOperationListShow,
  operateChooseAlbum,
  operateChooseSinger
} from './store/actionCreators'
import { getAlbumList } from '../../application/Album/store/actionCreators'
import { getUserMorePlayInfos } from '../../application/Login/store/actionCreators'
import { 
  getSongDetailRequest,
  getCommentRequest,
  trackOperation
} from '../../api/request'



function OperationsList (props) {
  const {
    showOperationList,
    operationType,
    operationSongId,
    operationSingersList,
    isPersonalFm,
    history,
    isLogin,
    userId,
    currentAlbum,
    ownPlaylist
  } = props
  const {
    toggleOperationListShowDispatch,
    insertNextSongDispatch,
    getAlbumListDispatch,
    getUserMorePlayInfosDispatch,
    operateChooseAlbumDispatch,
    operateChooseSingerDispatch,
    handleJump
  } = props
  const transform = prefixStyle("transform")

  const playListRef = useRef()
  const listWrapperRef = useRef()
  const confirmRef = useRef()
  const listContentRef = useRef()
  const contentRef = useRef()
  const toastRef = useRef()

  // 当弹框内Scroll组件没滑到顶部时 关闭弹框手动向下滑退视窗的功能
  const canTouch = useRef(false)

  const [isShow, setIsShow] = useState(false)
  // 对话框回调函数序号 0-删除歌曲 
  const [handleConfirmIndex, setHandleConfirmIndex] = useState(0)
  // 组件滑退功能相关
  const [startY, setStartY] = useState(0)
  const [initiated, setInitiated] = useState(false)
  const distanceRef = useRef(0)
  const clickToggle = useRef(true)

  const [songDetail, setSongDetail] = useState({
    name: '',
    al: {},
    ar: [],
    id: null
  })
  const [commentTotalCount, setCommentTotalCount] = useState(0)
  const [toastText, setToastText] = useState('')
  const [confirmText, setConfirmText] = useState('')

  useEffect(() => {
    if(showOperationList && operationType === 0 && operationSongId) {
      getSongDetailRequest(operationSongId)
      .then(res => {
        if(res.code === 200) {
          setSongDetail(res.songs[0])
          console.log(res.songs[0])
        }
      })
      getCommentRequest(operationSongId, 0, 1, 1)
      .then(res => {
        if(res.code === 200) {
          setCommentTotalCount(res.data.totalCount)
        }
      })
    }
  }, [showOperationList, operationType, operationSongId])

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

  const handleShowDialog = () => {
    return confirmRef.current.show()
  }

  // 对话框处理逻辑
  const handleConfirm = (index) => {
    switch(index) {
      case 0:
        trackOperation(0, currentAlbum.id, operationSongId)
          .then(res => {
            if(res.status === 200) {
              setToastText('已删除')
              toastRef.current.show()
              getAlbumListDispatch(currentAlbum.id)
              getUserMorePlayInfosDispatch(userId)
            }
          })
        break
      default:
    }
  }

  // 跳转歌手操作
  const handleJumpToSingleSinger = (id) => {
    props.history.push(`/singers/${id}`)
    toggleOperationListShowDispatch(false)
  }

  // 跳转歌手判断
  const handleJumpToSingerPage = () => {
    if(initiated || clickToggle.current === false) return
    if(songDetail.ar.length === 1) {
      handleJumpToSingleSinger(songDetail.ar[0].id)
    } else {
      operateChooseSingerDispatch(songDetail.ar)
    }
  }

  // 下一首播放
  const handleInsertSong = () => {
    if(initiated || clickToggle.current === false) return
    if(isPersonalFm) {
        setToastText('正在播放私人FM，无法添加到播放列表')
        toastRef.current.show()
        toggleOperationListShowDispatch(false)
      return 
    }
    setToastText('已添加到下一首播放')
    toastRef.current.show()
    insertNextSongDispatch(songDetail)
    toggleOperationListShowDispatch(false)
  }

  // 转换到 收藏到歌单 界面
  const handleJumpToCollectToAlbum = () => {
    if(initiated || clickToggle.current === false) return
    operateChooseAlbumDispatch()
  }

  // 打开评论页
  const handleShowCommentPage = () => {
    if(initiated || clickToggle.current === false) return
    if(commentTotalCount>0) {
      handleJump(`/comments/${operationSongId}+0`)
    }
    toggleOperationListShowDispatch(false)
  }

  // 收藏到歌单
  const handleCollectToAlbum = (pid) => {
    if(initiated || clickToggle.current === false) return
    trackOperation(1, pid, operationSongId)
      .then(res => {
        if(res.status === 200) {
          if(res.body.code === 200) {
            setToastText('已收藏')
          } else {
            setToastText(res.body.message)
          }
          toastRef.current.show()
          toggleOperationListShowDispatch(false)
        }
      })
  }

  // 删除
  const handleDeleteSongFromAlbum = () => {
    if(initiated || clickToggle.current === false) return
    if(
      history.location.pathname === '/dailyrecommend' ||
      history.location.pathname.startsWith('/singers/') || 
      !isLogin ||
      (currentAlbum && ownPlaylist.findIndex(item => item.id === currentAlbum.id) === -1 )
    ) {
      return
    } else {
      setConfirmText('确定将所选音乐从列表中删除？')
      toggleOperationListShowDispatch(false)
      setHandleConfirmIndex(0)
      handleShowDialog()
    }
  }

  const handleScroll = (pos) => {
    let state = (pos.y === 0 )
    canTouch.current = state
  }

  const handleTouchStart = e => {
    if(!canTouch.current && initiated) return

    let str = contentRef.current.style[transform]
    let y = getValueOfTransform(str, 'y') || 0

    listWrapperRef.current.style["transition"] = ""
    setStartY(e.nativeEvent.touches[0].pageY + y)
    setInitiated(true)
  }
  const handleTouchMove = e => {
    if(!canTouch.current || !initiated) return
    
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
    setInitiated(false)
    setTimeout(() => {
      clickToggle.current = true
    })
    listContentRef.current.enable()
    if(distanceRef.current >= listBoxTouchMoveDistance[operationType]) {
      toggleOperationListShowDispatch(false)
      distanceRef.current = 0
    } else {
      listWrapperRef.current.style["transition"] = "all 0.3s"
      listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`
    }
  }

  // 跳转到歌手
  const renderSingerChooseList = () => {
    return (<>
      <ListHeader>
        <h1 className="title">
          <p className="singer-title">请选择要查看的歌手</p>
        </h1>
      </ListHeader>
      <ScrollWrapper>
        <Scroll 
          ref={listContentRef}  
          onScroll={pos => handleScroll(pos)}
          bounceTop={false}
          bounceBottom={false}
        >
          <ListContent className="list-content_singer" ref={contentRef}>
            {
              operationSingersList.map((singer, index) => {
                return (
                  <ListItem 
                    className="list-item_singer btn-to-deep" 
                    key={singer.value.id}
                    onClick={() => handleJumpToSingleSinger(singer.value.id)}
                  >
                    <img className="singer-cover" src={singer.value.cover+'?param=42y42'} alt="" />
                    <p className="singer-name">{singer.value.name}</p>
                  </ListItem>
                )
              })
            }
          </ListContent>
        </Scroll>
      </ScrollWrapper>
    </>)
  }

  // 收藏到歌单
  const renderAlbumChooseList = () => {
    return (<>
      <ListHeader>
        <h1 className="title">
          <p className="album-title">收藏到歌单</p>
        </h1>
      </ListHeader>
      <ScrollWrapper>
        <Scroll 
          ref={listContentRef}  
          onScroll={pos => handleScroll(pos)}
          bounceTop={false}
          bounceBottom={false}
        >
          <ListContent className="list-content_album" ref={contentRef}>
            {
              ownPlaylist.map((album, index) => {
                return (
                  <ListItem 
                    className="list-item_album btn-to-deep" 
                    key={album.id}
                    onClick={() => handleCollectToAlbum(album.id)}
                  >
                    {
                      index === 0 ? 
                      <i className="iconfont favourite-icon">&#xe8c3;</i> :
                      <img className="album-cover" src={album.coverImgUrl+'?param=42y42'} alt="" />
                    }
                    <p className="album-detail">
                      <span className="album-name">{index === 0 ? '我喜欢的音乐' : album.name}</span>
                      <span className="album-count">{album.trackCount}首</span>
                    </p>
                  </ListItem>
                )
              })
            }
          </ListContent>
        </Scroll>
      </ScrollWrapper>
    </>)
  }

  // 操作歌曲
  const renderSongOperationList = () => {
    return (<>
      <ListHeader>
        <h1 className="title">
          <img className="song-cover" src={songDetail.al?.picUrl || require('./music.png')} alt="album-cover"/>
          <p className="song-detail">
            <span className="song-detail_name">歌曲：{songDetail.name}</span>
            <span className="song-detail_artist">{getName(songDetail.ar)}</span>
          </p>
        </h1> 
      </ListHeader>
      <ScrollWrapper className="scroll-wrapper_song">
        <Scroll 
          ref={listContentRef}  
          onScroll={pos => handleScroll(pos)}
          bounceTop={false}
          bounceBottom={false}
        >
          <ListContent ref={contentRef}>
            <ListItem className={`${isPersonalFm ? "btn-unable" : ""} btn-to-deep`} onClick={handleInsertSong}>
              <i className="iconfont iconfont_icon">&#xe612;</i>
              <span className="option-text">下一首播放</span>
            </ListItem>
            <ListItem className="btn-to-deep" onClick={handleJumpToCollectToAlbum}>
              <i className="iconfont iconfont_icon">&#xe612;</i>
              <span className="option-text">收藏到歌单</span>
            </ListItem>
            <ListItem className="btn-to-deep" onClick={handleShowCommentPage}>
              <i className="iconfont iconfont_icon">&#xe607;</i>
              <span className="option-text">评论 {commentTotalCount !== 0 && `(${commentTotalCount})`}</span>
            </ListItem>
            <ListItem className="btn-to-deep">
              <i className="iconfont iconfont_icon">&#xe602;</i>
              <span className="option-text">分享</span>
            </ListItem>
            <ListItem className="btn-to-deep" onClick={handleJumpToSingerPage}>
              <i className="iconfont iconfont_icon">&#xe612;</i>
              <span className="option-text">歌手：{getName(songDetail.ar)}</span>
            </ListItem>
            <ListItem className="btn-to-deep">
              <i className="iconfont iconfont_icon">&#xe600;</i>
              <span className="option-text">相关视频</span>
            </ListItem>
            {
              !(
                history.location.pathname === '/dailyrecommend' ||
                history.location.pathname.startsWith('/singers/') || 
                !isLogin ||
                (currentAlbum && ownPlaylist.findIndex(item => item.id === currentAlbum.id) === -1 )
              ) ? 
              <ListItem className="btn-to-deep" onClick={handleDeleteSongFromAlbum}>
                <i className="iconfont iconfont_icon">&#xe610;</i>
                <span className="option-text">删除</span>
              </ListItem> : null
            }
          </ListContent>
        </Scroll>
      </ScrollWrapper>
    </>)
  }

  return (
    <CSSTransition
      in={showOperationList}
      timeout={300}
      classNames="list-fade"
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
    >
      <>
        <PlayListWrapper
          ref={playListRef}
          style={isShow ? {display: "block"} : {display: "none"}}
          onClick={() => {
            toggleOperationListShowDispatch(false)
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
            {
              operationType === 0 ? 
              renderSongOperationList() : operationType === 1 ?
              renderAlbumChooseList() : operationType === 2 ?
              renderSingerChooseList() : null
            }
          </div>
        </PlayListWrapper>
        <Confirm 
          ref={confirmRef}
          text={confirmText}
          handleConfirmIndex={handleConfirmIndex}
          handleConfirm={handleConfirm}
          cancelBtnText={"取消"}
          confirmBtnText={"确定"}
        />
        <Toast text={toastText} raise={true}  ref={toastRef} />
      </>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  ...state['player'],
  ...state['operation'],
  isLogin: state['user']['isLogin'],
  ownPlaylist: state['user']['userPlaylist']['own'],
  currentAlbum: state['album']['currentAlbum'],
  userId: state['user']['userId']
  
})

const mapDispatchToProps = dispatch => ({
  toggleOperationListShowDispatch(data) {
    dispatch(changeOperationListShow(data))
  },
  operateChooseAlbumDispatch() {
    dispatch(operateChooseAlbum())
  },
  insertNextSongDispatch(data) {
    dispatch(insertNextSong(data))
  },
  getAlbumListDispatch(id) {
    dispatch(getAlbumList(id))
  },
  getUserMorePlayInfosDispatch(id) {
    dispatch(getUserMorePlayInfos(id))
  },
  operateChooseSingerDispatch(data) {
    dispatch(operateChooseSinger(data))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(OperationsList))