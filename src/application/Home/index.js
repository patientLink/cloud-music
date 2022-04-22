import React, {useState, useEffect} from 'react'
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
import OperaionsList from '../../components/OperationsList'

const handleAddClassName = (ele) => {
  if(ele.classList.contains('btn-to-deep')) {
    ele.classList.add('btn-to-deep-mouseOn')
  } else {
    if(ele.parentElement) {
      handleAddClassName(ele.parentElement)
    }
  }
}
const handleRemoveClassName = (ele) => {
  if(ele.classList.contains('btn-to-deep') && ele.classList.contains('btn-to-deep-mouseOn')) {
    ele.classList.remove('btn-to-deep-mouseOn')
  } else {
    if(ele.parentElement) {
      handleRemoveClassName(ele.parentElement)
    }
  }
}

// 全局事件 按下按钮后背景色加深
const changeTouchingButtonBgColor = (e) => {
  handleAddClassName(e.target)
}
const changeTouchingButtonBgColorOut = (e) => {
  handleRemoveClassName(e.target)
}

function Home(props) {
  const {
    route,
    userId,
    isLogin,
    userDetail,
    userSubCount,
    userLevel,
    userLikelist,
    userPlaylist,
  } = props
  // console.log(props)
  const {
    getStatus,
    getDetail,
    logout
  } = props

  const [showSidebar, setShowSidebar] = useState(false)

  useEffect(() => {
    document.addEventListener('touchstart', changeTouchingButtonBgColor)
    document.addEventListener('touchend', changeTouchingButtonBgColorOut)
    return () => {
      document.removeEventListener('touchstart', changeTouchingButtonBgColor)
      document.removeEventListener('touchend', changeTouchingButtonBgColorOut)
    }
  }, [])

  // 每次组件创建挂载时判断一下登录状态
  useEffect(() => {
    getStatus()
  }, [getStatus])

  // 用户id更改时获取其信息
  useEffect(() => {
    if(userId) {
      getDetail(userId)
    }
  }, [userId, getDetail])

  const handleHideSidebar = () => {
    setShowSidebar(false)
  }

  const handleJump = (url) => {
    setShowSidebar(false)
    props.history.push(url)
  }

  const handleLogout = () => {
    logout()
    setShowSidebar(false)
    props.history.push('/login')
  }


  return (
    <Layout>
      <Top>
        <span className="iconfont menu btn-to-deep" onClick={() => {setShowSidebar(true)}}>&#xe627;</span>
        <span className="title">网易云音乐</span>
        <span className="iconfont search btn-to-deep" onClick={() => props.history.push('/search')}>&#xe603;</span>
      </Top>
      <Tab>
        <NavLink to="/recommend" className={"btn-to-deep"} activeClassName="selected"><TabItem><span>推荐</span></TabItem></NavLink>
        <NavLink to="/singers" className={"btn-to-deep"} activeClassName="selected"><TabItem><span>歌手</span></TabItem></NavLink>
        <NavLink to="/rank" className={"btn-to-deep"} activeClassName="selected"><TabItem><span>排行榜</span></TabItem></NavLink>
      </Tab>
      {renderRoutes(route.routes)}
      <Player history={props.history}></Player>
      <Sidebar 
        show={showSidebar} 
        isLogin={isLogin}
        history={props.history}
        id={userId}
        handleHide={handleHideSidebar}
        handleJump={handleJump}
        handleLogout={handleLogout}
        userDetail={userDetail}
        userSubCount={userSubCount}
        userLevel={userLevel}
        userLikeCount={userLikelist.length}
        userPlaylist={userPlaylist}
        ></Sidebar>
      <OperaionsList 
        handleJump={handleJump}
        history={props.history}
      />
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