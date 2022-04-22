import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react'
import {
  Container, 
  TopDesc, 
  Menu
} from './style'
import {CSSTransition} from 'react-transition-group'
import Header from '../../baseUI/header'
import Scroll from '../../baseUI/scroll'
import {getCount, isEmptyObject} from '../../api/utils'
import globalStyle from '../../assets/global-style'
import {connect} from 'react-redux'
import { updateCurrentAlbum, getAlbumList } from './store/actionCreators'
import { getFirstPageCommentsList } from '../CommentsList/store/actionCreators'
import { collectAlbumAndRefresh } from '../Login/store/actionCreators'
import SongsList from '../SongsList'
import {HEADER_HEIGHT} from '../../api/config'
import MusicNote from '../../baseUI/music-note'
import { getAlbumAllTracksRequest } from '../../api/request'

function Album(props) {
  const [showStatus, setShowStatus] = useState(true)
  const [title, setTitle] = useState("歌单")
  const [isMarquee, setIsMarquee] = useState(false)

  const headerEl = useRef()
  const musicNoteRef = useRef()

  const id = props.match.params.id

  const {
    currentAlbum, 
    enterLoading, 
    songsCount, 
    userPlaylist
  } = props
  const {
    getAlbumDataDispatch, 
    updateCurrentAlbumDispatch,
    getCommentsDispatch, 
    collectAlbumDispatch
  } = props

  const ownListIds = useMemo(() => userPlaylist.own.map(item => item.id), [userPlaylist])
  const collectListIds = useMemo(() => userPlaylist.collect.map(item => item.id), [userPlaylist])


  useEffect(() => {
    getAlbumDataDispatch(id)
  }, [getAlbumDataDispatch, id])

  useEffect(() => {
    if(currentAlbum.tracks && currentAlbum.tracks.length !== currentAlbum.trackCount) {
      getAlbumAllTracksRequest(id).then(res => {
        if(res.code === 200) {
          updateCurrentAlbumDispatch({
            ...currentAlbum,
            tracks: res.songs
          })
        }
      })
    }
  }, [currentAlbum])

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({x, y})
  }

  const handleBack = useCallback(() => {
    setShowStatus(false)
  }, [])

  const handleScroll = useCallback((pos) => {
    let minScrollY = -HEADER_HEIGHT
    let percent = Math.abs(pos.y / minScrollY)
    let headerDom = headerEl.current
    if(pos.y < minScrollY) {
      headerDom.style.backgroundColor = globalStyle["theme-color"]
      headerDom.style.opacity = Math.min(1, (percent-1)/2)
      setTitle(currentAlbum.name)
      setIsMarquee(true)
    } else {
      headerDom.style.backgroundColor = ""
      headerDom.style.opacity = 1
      setTitle("歌单")
      setIsMarquee(false)
    }
  }, [currentAlbum])
  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={currentAlbum.coverImgUrl} alt="" />
          <div className="play_count">
            <i className="iconfont play">&#xe619; </i>
            <span className="count">
              {getCount(currentAlbum.playCount)}
            </span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">
            {currentAlbum.name}
          </div>
          {
            currentAlbum.creator ? 
            <div className="person" onClick={() => props.history.push(`/user/${currentAlbum.creator.userId}`)}>
              <div className="avatar">
                <img src={currentAlbum.creator.avatarUrl} alt=""/>
              </div>
              <div className="name">
                {currentAlbum.creator.nickname}
              </div>
            </div> : null
          }
        </div>
      </TopDesc>
    )
  }

  const renderMenu = () => {
    return (
      <Menu>
        {
          ownListIds.find(item => item === currentAlbum.id) ||
          collectListIds.find(item => item === currentAlbum.id) ? 
          ownListIds[0] === currentAlbum.id ? 
          (
            <div className="btn-unable">
              <i className="iconfont">&#xe640;</i>
              已收藏
            </div>
          ) :
          (
            <div onClick={() => collectAlbumDispatch(2, currentAlbum.id)}>
              <i className="iconfont">&#xe640;</i>
              已收藏
            </div>
          ) :
          (
          <div onClick={() => collectAlbumDispatch(1, currentAlbum.id)}>
            <i className="iconfont">&#xe606;</i>
            {currentAlbum.subscribedCount === 0 ? '收藏' : getCount(currentAlbum.subscribedCount)}
          </div>
          )
        }
        <div onClick={() => {
          if(currentAlbum.commentCount > 0) {
            getCommentsDispatch(currentAlbum.id)
            props.history.push(`/comments/${currentAlbum.id}+2`)
          }
        }}>
          <i className="iconfont">&#xe607;</i>
          {currentAlbum.commentCount ? getCount(currentAlbum.commentCount) : '评论'}
        </div>
        <div>
          <i className="iconfont">&#xe602;</i>
          分享
        </div>
      </Menu>
    )
  }

  return (
    <CSSTransition
      in={showStatus}
      timeout={400}
      classNames="fly"
      appear={true}
      onExited={props.history.goBack}
    >
      <Container play={songsCount}>
        <Header 
          ref={headerEl} 
          title={title} 
          handleClick={handleBack}
          isMarquee={isMarquee}
          ></Header>
        {
          !isEmptyObject(currentAlbum) ? (
            <Scroll bounceTop={false} onScroll={handleScroll} enterLoading={enterLoading}>
              <div>
                {renderTopDesc()}
                {renderMenu()}
                <SongsList 
                  songs={currentAlbum.tracks}
                  trackCount={currentAlbum.trackCount}
                  showBackground={true}
                  musicAnimation={musicAnimation}
                ></SongsList>
              </div>
            </Scroll>
          ) : null
        }
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  ...state['album'],
  songsCount: state['player']['playList'].length,
  userPlaylist: state['user']['userPlaylist']
})

const mapDispatchToProps = dispatch => ({
  getAlbumDataDispatch(id) {
    dispatch(getAlbumList(id))
  },
  updateCurrentAlbumDispatch(data) {
    dispatch(updateCurrentAlbum(data))
  },
  getCommentsDispatch(id) {
    dispatch(getFirstPageCommentsList(id, 2, 99))
  },
  collectAlbumDispatch(t, id) {
    dispatch(collectAlbumAndRefresh(t, id))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album))