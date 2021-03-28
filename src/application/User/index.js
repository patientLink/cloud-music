import React, {useState, useRef, useEffect, useCallback, useReducer} from 'react'
import {CSSTransition} from 'react-transition-group'
import {Container, ImgWrapper, InfoContent, AlbumListWrapper, BgLayer} from './style'
import Header from '../../baseUI/header'
import Scroll from '../../baseUI/scroll'
import {HEADER_HEIGHT} from './../../api/config'
import {connect} from 'react-redux'
import UserDetail from '../../components/userDetail'
import {changeFullScreen, changeShowCommentsList} from '../Player/store/actionCreators'
import {getUserDetail, getUserPlaylist} from '../../api/request'
import {getGenerator} from '../../api/utils'

const initState = () => ({
  state: {
    level: 0,
    listenSongs: 0,
    userPoint: {},
    mobileSign: false,
    pcSign: false,
    profile: {
      nickname: '用户',
      backgroundUrl: require('./defaultBg.jpg'),
      followMe: false,
      followed: false,
      followeds: 0,
      follows: 0,
      gender: 1,
      birthday: 987738655033
    }
  },
  playlist: {
    playlist: []
  }
})

function reducer(state, action) {
  switch (action.type) {
    case 'CHANGE_USER_STATE':
      console.log('change_state')
      return {...state, state: action.data}
    case 'CHANGE_USER_PLAYLIST': 
      console.log('change_playlist')
      return {...state, playlist: action.data}
    case 'RESET_USER_INFO':
      return initState()
  }
}

function User(props) {
  const [showStatus, setShowStatus] = useState(true)
  const [userInfo, dispatch] = useReducer(reducer, initState())
  // console.log(props)
  const {
    playing,
    fullScreen,
    userId
  } = props

  const {
    toggleFullScreenDispatch,
    toggleShowCommentsListDispatch
  } = props

  const [activeTag, setActiveTag] = useState(0)
  const [isMyself, setIsMyself] = useState(false)

  const imageWrapper = useRef()
  const songScrollWrapper = useRef()
  const songScroll = useRef()
  const header = useRef()
  const layer = useRef()
  const clientWidthRatio = useRef()
  const InfoContentRef = useRef()

  const initialHeight = useRef(0)
  const OFFSET = 10
  const LAYER_HEIGHT = 30

  useEffect(() => {
    const id = props.match.params.id
    if(id == userId) {
      setIsMyself(true)
    }
    getUserDetail(id)
    .then(res => {
      dispatch({type: 'CHANGE_USER_STATE', data: res})
    })
    getUserPlaylist(id)
    .then(res => {
      dispatch({type: 'CHANGE_USER_PLAYLIST', data: res})
    })
    
    // getSingerDataDispatch(id)
    clientWidthRatio.current = document.documentElement.clientWidth / 375
  }, [])

  useEffect(() => {
    let h = imageWrapper.current.offsetHeight
    songScrollWrapper.current.style.top = `${h - OFFSET}px`
    initialHeight.current = h
    layer.current.style.top = `${h - OFFSET}px`
    songScroll.current.refresh()
    console.log('refresh')
  }, [])

  // const musicAnimation = (x, y) => {
  //   musicNoteRef.current.startAnimation({x, y})
  // }

  const handleJump = useCallback((id) => {
    toggleShowCommentsListDispatch(false)
    props.history.push(`/album/${id}`)
  }, [])

  const handleRefresh = useCallback(() => {
    songScroll.current.refresh()
  }, [])

  const setShowStatusFalse = useCallback(() => {
    setShowStatus(false)
  }, [])

  const getGen = () => {
    return getGenerator(userInfo.state['profile']['birthday'])
  }

  const handleScroll = useCallback(pos => {

    let height = initialHeight.current
    const newY = pos.y
    const imageDOM = imageWrapper.current
    const infoDOM = InfoContentRef.current
    const headerDOM = header.current
    const layerDOM = layer.current
    const minScrollY = -(height - OFFSET * clientWidthRatio.current) + HEADER_HEIGHT * clientWidthRatio.current
    const percent = Math.abs(newY / height)

    if(newY > 0) {
      imageDOM.style["transform"] = `scale(${1+percent})`
      layerDOM.style.top = `${height - Math.floor(OFFSET * clientWidthRatio.current) + newY}px`
      infoDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`
    } else if (newY >= minScrollY) {
      layerDOM.style.top = `${height - Math.floor(OFFSET * clientWidthRatio.current) - Math.abs(newY)}px`
      // layerDOM.style.zIndex = 1
      imageDOM.style.paddingTop = "75%"
      imageDOM.style.filter = `brightness(${Math.max(1-percent, .3)})`
      imageDOM.style.height = 0
      imageDOM.style.zIndex = -1

      infoDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`
      infoDOM.style["opacity"] = `${1 - percent * 2}`

    } else if (newY < minScrollY) {
      layerDOM.style.top = `${(HEADER_HEIGHT) * clientWidthRatio.current}px`
      // layerDOM.style.zIndex = 1
      headerDOM.style.zIndex = 100
      imageDOM.style.height = `${(HEADER_HEIGHT + LAYER_HEIGHT) * clientWidthRatio.current}px`
      imageDOM.style.paddingTop = 0
      imageDOM.style.zIndex = 99
    }
  }, [])


  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={() => {
        // if(playing && !fullScreen) {
        //   toggleFullScreenDispatch(true)
        // }
        props.history.goBack()
      }}
    >
      <Container play={playing}>
        <Header 
          handleClick={setShowStatusFalse}
          title={userInfo.state['profile'] && userInfo.state['profile']['nickname']}
          ref={header}
        ></Header>
        <ImgWrapper ref={imageWrapper} bgUrl={userInfo.state['profile'] && userInfo.state['profile']['backgroundUrl']}>
          <div className="filter"></div>
        </ImgWrapper>
        <InfoContent ref={InfoContentRef} gender={userInfo.state['profile']['gender']}>
          <img className="avatarImg" src={(userInfo.state['profile']['avatarUrl']) || require('./defaultAvatar.jpg')} />
          <div className="detail">
            <span className="name">{userInfo.state['profile']['nickname']}</span>
            <div className="follow">
              <span onClick={() => props.history.push(`/follow/${props.match.params.id}`)}>关注 {userInfo.state['profile']['follows']} </span>
              <span onClick={() => props.history.push(`/followed/${props.match.params.id}`)}>粉丝 {userInfo.state['profile']['followeds']} </span>
            </div>
            <div className="class">
              <span className="tag gender">
                {
                  userInfo.state['profile']['gender'] === 1 ? 
                  <span className="iconfont icon">&#xe638;</span>
                  :
                  <span className="iconfont icon">&#xe6c3;</span>
                }
                <span> {getGen()}</span>
                
              </span>
              <span className="tag">Lv.{userInfo.state['level']}</span>
            </div>
            {
              isMyself ? 
                '' 
                :
                userInfo.state['profile']['followed'] ? 
                  <button className="followed">
                    <span className="iconfont">&#xe8bc;</span>
                    {userInfo.state['profile']['followTime']}
                  </button> 
                  :
                  <button className="follow_btn">
                    <span className="iconfont">&#xe61a;</span>关注
                  </button>
            }
          </div>
        </InfoContent>
        <BgLayer ref={layer}>
          {
            ['主页','动态'].map((item, index) => {
              return (
                <span 
                  className={activeTag === index ? 'tag active' : 'tag'} 
                  onClick={() => setActiveTag(index)}
                  key={index}>
                  {item}
                </span>
              )
            })
          }
          {/* <span className="tag active">主页</span>
          <span className="tag">动态</span> */}
        </BgLayer>
        <AlbumListWrapper ref={songScrollWrapper}>
          <Scroll onScroll={handleScroll} ref={songScroll} >
            <UserDetail 
              state={userInfo.state} 
              playlist={userInfo.playlist.playlist} 
              handleRefresh={handleRefresh}
              handleJump={handleJump}
              ></UserDetail>
          </Scroll>
        </AlbumListWrapper>
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  playing: state['player']['playList'].length,
  fullScreen: state['player']['fullScreen'],
  userId: state['user']['userId']
})

const mapDispatchToProps = dispatch => ({
  toggleFullScreenDispatch(data) {
    dispatch(changeFullScreen(data));
  },
  toggleShowCommentsListDispatch(data) {
    dispatch(changeShowCommentsList(data))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(User))