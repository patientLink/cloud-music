import React, {useRef, useMemo} from 'react'
import {Block, SidebarContainer, SidebarCover} from './style'
import {CSSTransition} from 'react-transition-group'
import {getGenerator} from '../../api/utils'
import {getPersonalFm} from '../../api/request'
import {connect} from 'react-redux'
import {
  changePlayList, 
  changeCurrentIndex, 
  changeSequencePlayList, 
  changeFmMode,
  resetPlayer,
  changePlayMode
} from '../Player/store/actionCreators'
import { playMode } from '../../api/config'

function Sidebar(props) {
  const {
    id,
    show, 
    isLogin, 
    userDetail, 
    userLevel, 
    userLikeCount,
    userPlaylist
  } = props
  
  const {
    handleJump,
    handleHide, 
    handleLogout
  } = props

  const {
    changePlayListDispatch, 
    changeCurrentIndexDispatch, 
    changeSequencePlayListDispatch,
    changeFmModeDispatch,
    changeModeDispatch,
    clearDispatch
  } = props

  const sidebarCoverRef = useRef()
  const sidebarContainerRef = useRef()

  const handleHideClick = (e) => {
    e.stopPropagation()
    handleHide()
  }

  const getGen = useMemo(() => {
    return getGenerator(userDetail.birthday)
  }, [userDetail])

  const handlePersonalFm = () => {
    getPersonalFm()
    .then(res => {
      if(res.code === 200) {
        handleHide()
        clearDispatch()
        changePlayListDispatch(res.data)
        changeSequencePlayListDispatch(res.data)
        changeModeDispatch(playMode.sequence)
        changeFmModeDispatch(true)
        changeCurrentIndexDispatch(0)
      }
    })
    console.log('私人fm')
  }

  return (
    <CSSTransition
      in={show}
      timeout={300}
      classNames="side"
      onEnter={() => {
        sidebarCoverRef.current.style.display = "block"
        sidebarContainerRef.current.style.display = "flex"
      }}
      onExited={() => {
        sidebarCoverRef.current.style.display = "none"
        sidebarContainerRef.current.style.display = "none"
      }}
    >
      <React.Fragment>
        <SidebarCover show={show} ref={sidebarCoverRef} >
          <div className="layer" onClick={handleHideClick}></div>
          <SidebarContainer ref={sidebarContainerRef} className="slide">
            <Block className="topBlock" gender={userDetail.gender}  isLogin={isLogin} bgUrl={userDetail.backgroundUrl}>
              {
                isLogin ? 
                <React.Fragment>
                  <img className="avatarImg" alt='avatar' src={(userDetail && userDetail.avatarUrl) || require('./singer.png')} />
                  <div className="detail">
                    <span className="name">{userDetail && userDetail.nickname}</span>
                    <div className="follow">
                      <span onClick={() => handleJump(`/follow/${id}`)}>关注 {userDetail.follows || 0} </span>
                      <span onClick={() => handleJump(`/followed/${id}`)}>粉丝 {userDetail.followeds || 0} </span>
                    </div>
                    <div className="class">
                      <span className="tag gender">
                        {
                          userDetail.gender === 1 ? 
                          <span className="iconfont icon">&#xe638;</span>
                          :
                          <span className="iconfont icon">&#xe6c3;</span>
                        }
                        <span> {getGen}</span>
                        
                      </span>
                      <span className="tag">Lv.{userLevel && userLevel.level}</span>
                    </div>
                  </div>
                  <div className="btn_wrapper btn-to-deep" onClick={() => handleJump(`/user/${id}`)}>
                    <i className="iconfont btn">&#xe604;</i>
                  </div>
                  
                </React.Fragment>
                : 
                <React.Fragment>
                  <img className="avatarImg" alt="avatar" src={require('./singer.png')} />
                  <div className="detail">
                    <span className="name" onClick={() => handleJump('/login')}>立即登录<span className="iconfont">&#xe604;</span></span>
                  </div>
                </React.Fragment>
              }
            </Block>
            {
              isLogin ? 
              <>
                <Block className="my-favourite normal-block btn-to-deep" onClick={() => handleJump(`/album/${userPlaylist.own[0].id}`)}>
                  <span className="iconfont normal-icon favourite-icon">&#xe8c3;</span>
                  <span className="favourite-text">
                    <span>我喜欢的音乐</span>
                    <span>{userLikeCount}首</span>
                  </span>
                  <i className="iconfont btn">&#xe604;</i>
                </Block>
                <Block className="personal-fm normal-block btn-to-deep" onClick={handlePersonalFm}>
                  <span className="iconfont normal-icon fm-icon">&#xe616;</span>
                  <span>私人FM</span>
                  <i className="iconfont btn">&#xe604;</i>
                </Block>
                <Block className="daily-recommend normal-block btn-to-deep" onClick={() => {handleJump('/dailyrecommend')}}>
                  <span className="iconfont normal-icon daily-recommend-icon">&#xe60c;</span>
                  <span>每日歌曲推荐</span>
                  <i className="iconfont btn">&#xe604;</i>
                </Block>
                <div className="logout btn-to-deep" onClick={handleLogout}>
                  切换账号
                </div>
              </>
               : 
              ''
            }
          </SidebarContainer>
        </SidebarCover>
      </React.Fragment>
    </CSSTransition>
    
  )
}

const mapDispatchToProps = dispatch => ({
  changePlayListDispatch(data) {
    dispatch(changePlayList(data))
  },
  changeCurrentIndexDispatch(data) {
    dispatch(changeCurrentIndex(data))
  },
  changeSequencePlayListDispatch(data) {
    dispatch(changeSequencePlayList(data))
  },
  changeModeDispatch(data) {
    dispatch(changePlayMode(data))
  },
  changeFmModeDispatch(data) {
    dispatch(changeFmMode(data))
  },
  clearDispatch() {
    dispatch(resetPlayer())
  }
})

export default connect(null, mapDispatchToProps)(React.memo(Sidebar))