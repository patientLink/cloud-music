import React, {useState, useCallback, useEffect} from 'react'
import {renderRoutes} from 'react-router-config'
import {
  Top, 
  Tab, 
  TabItem,
  Layout
} from './style'
import {NavLink} from 'react-router-dom'
import Player from '../Player'
import Sidebar from '../Sidebar'
import {connect} from 'react-redux'
import {getLoginStatus, getUserMore, clearUser} from '../Login/store/actionCreators'

function Home(props) {
  const {
    route,
    userId,
    isLogin,
    userDetail,
    userSubCount,
    userLevel,
    userLikelist,
    userPlaylist
  } = props
  // console.log(props)
  const {
    getStatus,
    getDetail,
    logout
  } = props

  const [showSidebar, setShowSidebar] = useState(false)

  // 每次组件创建挂载时判断一下登录状态
  useEffect(() => {
    getStatus()
  }, [])

  // 用户id更改时获取其信息
  useEffect(() => {
    console.log('change')
    if(userId) {
      getDetail(userId)
    }
  }, [userId])

  const handleHideSidebar = () => {
    setShowSidebar(false)
  }

  const jumpToLogin = () => {
    setShowSidebar(false)
    props.history.push('/login')
  }

  const jumpToUser = () => {
    setShowSidebar(false)
    props.history.push(`/user/${userId}`)
  }

  const jumpToFollow = () => {
    setShowSidebar(false)
    props.history.push(`/follow/${userId}`)
  }

  const jumpToFollowed = () => {
    setShowSidebar(false)
    props.history.push(`/followed/${userId}`)
  }

  const handleLogout = () => {
    logout()
    setShowSidebar(false)
    props.history.push('/login')
  }

  const jumpToAlbum = (id) => {
    props.history.push(`/album/${id}`)
    setShowSidebar(false)
  }

  return (
    <Layout>
      <Top>
        <span className="iconfont menu" onClick={() => {setShowSidebar(true)}}>&#xe627;</span>
        <span className="title">网易云音乐</span>
        <span className="iconfont search" onClick={() => props.history.push('/search')}>&#xe603;</span>
      </Top>
      <Tab>
        <NavLink to="/recommend" activeClassName="selected"><TabItem><span>推荐</span></TabItem></NavLink>
        <NavLink to="/singers" activeClassName="selected"><TabItem><span>歌手</span></TabItem></NavLink>
        <NavLink to="/rank" activeClassName="selected"><TabItem><span>排行榜</span></TabItem></NavLink>
      </Tab>
      {renderRoutes(route.routes)}
      <Player history={props.history}></Player>
      <Sidebar 
        show={showSidebar} 
        isLogin={isLogin}
        handleHide={handleHideSidebar}
        handleLogin={jumpToLogin}
        handleLogout={handleLogout}
        jumpToAlbum={jumpToAlbum}
        jumpToUser={jumpToUser}
        jumpToFollow={jumpToFollow}
        jumpToFollowed={jumpToFollowed}
        userDetail={userDetail}
        userSubCount={userSubCount}
        userLevel={userLevel}
        userLikeCount={userLikelist.length}
        userPlaylist={userPlaylist}
        ></Sidebar>
      
    </Layout>
    
  )
}

const mapStateToProps = state => ({
  ...state['user']
})

const mapDispatchToProps = dispatch => ({
  getStatus() {
    getLoginStatus(dispatch)
  },
  getDetail(id) {
    dispatch(getUserMore(id))
  },
  logout() {
    dispatch(clearUser)
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Home))