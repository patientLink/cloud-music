import React, {useState, useRef, useEffect, useMemo} from 'react'
import {Block, SidebarContainer, SidebarCover} from './style'
import {CSSTransition} from 'react-transition-group'
import {getGenerator} from '../../api/utils'

function Sidebar(props) {
  const {
    show, 
    isLogin, 
    userDetail, 
    userSubCount, 
    userLevel, 
    userLikeCount,
    userPlaylist
  } = props
  
  const {
    handleHide, 
    handleLogin, 
    handleLogout,
    jumpToAlbum,
    jumpToUser,
    jumpToFollow,
    jumpToFollowed
  } = props

  const sidebarCoverRef = useRef()
  const sidebarContainerRef = useRef()

  useEffect(() => {
    console.log(props)
  }, [])

  const handleHideClick = (e) => {
    e.stopPropagation()
    handleHide()
  }


  const getGen = useMemo(() => {
    return getGenerator(userDetail.birthday)
  }, [userDetail])

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
                  <img className="avatarImg" src={(userDetail && userDetail.avatarUrl) || require('./singer.png')} />
                  <div className="detail">
                    <span className="name">{userDetail && userDetail.nickname}</span>
                    <div className="follow">
                      <span onClick={() => jumpToFollow()}>关注 {userDetail.follows || 0} </span>
                      <span onClick={() => jumpToFollowed()}>粉丝 {userDetail.followeds || 0} </span>
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
                  <div className="btn_wrapper" onClick={() => jumpToUser()}>
                    <i className="iconfont btn">&#xe604;</i>
                  </div>
                  
                </React.Fragment>
                : 
                <React.Fragment>
                  <img className="avatarImg" src={require('./singer.png')} />
                  <div className="detail">
                    <span className="name" onClick={handleLogin}>立即登录<span className="iconfont">&#xe604;</span></span>
                  </div>
                </React.Fragment>
                
              }
            </Block>
            {
              isLogin ? 
              <Block className="my-favourite" onClick={() => jumpToAlbum(userPlaylist.own[0].id)}>
                <span className="iconfont favourite-icon">&#xe8c3;</span>
                <span className="favourite-text">
                  <span>我喜欢的音乐</span>
                  <span>{userLikeCount}首</span>
                </span>
                <i className="iconfont btn">&#xe604;</i>
              </Block> : 
              ''
            }
            
            {
              isLogin ? 
              <div className="logout" onClick={handleLogout}>
                切换账号
              </div> : 
              ''
            }
            
          </SidebarContainer>
        </SidebarCover>
      </React.Fragment>
    </CSSTransition>
    
  )
}

export default React.memo(Sidebar)