import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react'
import {
  Container, 
  TopDesc, 
  Menu,
  SongList,
  SongItem
} from './style'
import {CSSTransition} from 'react-transition-group'
import Header from '../../baseUI/header'
import Scroll from '../../baseUI/scroll'
import {getCount, getName, isEmptyObject} from '../../api/utils'
import globalStyle from '../../assets/global-style'
import {connect} from 'react-redux'
import { changeEnterLoading, getAlbumList } from './store/actionCreators'
import { getFirstPageCommentsList } from '../CommentsList/store/actionCreators'
import SongsList from '../SongsList'
import {HEADER_HEIGHT} from '../../api/config'
import MusicNote from '../../baseUI/music-note'

function Album(props) {
  const [showStatus, setShowStatus] = useState(true)
  const [title, setTitle] = useState("歌单")
  const [isMarquee, setIsMarquee] = useState(false)

  const headerEl = useRef()
  const musicNoteRef = useRef()

  const id = props.match.params.id

  const {currentAlbum, enterLoading, songsCount} = props
  const {getAlbumDataDispatch, getCommentsDispatch} = props

  useEffect(() => {
    getAlbumDataDispatch(id)
  }, [getAlbumDataDispatch, id])

  // let collectCount = useMemo(() => {
    
  // }, [currentAlbum]) 

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
              {/* {(currentAlbum.subscribedCount/10000).toFixed(1)} 万 */}
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
        <div>
          <i className="iconfont">&#xe606;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe608;</i>
          更多
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
      unmountOnExit
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
                  collectCount={getCount(currentAlbum.subscribedCount)} 
                  showCollect={true} 
                  songs={currentAlbum.tracks}
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
  songsCount: state['player']['playList'].length
})

const mapDispatchToProps = dispatch => ({
  getAlbumDataDispatch(id) {
    dispatch(changeEnterLoading(true))
    dispatch(getAlbumList(id))
  },
  getCommentsDispatch(id) {
    dispatch(getFirstPageCommentsList(id, 2, 99))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album))