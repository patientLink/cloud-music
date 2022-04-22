import React, { useCallback, useEffect, useState } from 'react'
import {Container, ListWrapper} from './style'
import {connect} from 'react-redux'
import {
  getFollowList, 
  getFollowedList,
  getMoreFollowList,
  getMoreFollowedList
} from './store/actionCreators'
import {CSSTransition} from 'react-transition-group'
import Header from '../../baseUI/header'
import Scroll from '../../baseUI/scroll'
import LazyLoad, {forceCheck} from 'react-lazyload'

function Follow(props) {

  const {
    id,
    list,
    loading,
    more,
    type,
    playing
  } = props

  const {
    getFollowListDispatch,
    getFollowedListDispatch,
    getMoreFollowListDispatch,
    getMoreFollowedListDispatch
  } = props

  const [showFollow, setShowFollow] = useState(true)

  useEffect(() => {
    const comp = props.match.url.split('/')[1]
    const uid = Number(props.match.params.id)
    if( !isNaN(uid) && Number.isInteger(uid) ) {
      switch(comp) {
        case 'follow':
          getFollowListDispatch(uid)
          break
        case 'followed':
          getFollowedListDispatch(uid)
          break
        default:
          return
      }
    }
    console.log(props)

  }, [])

  const handleBack = useCallback(() => {
    setShowFollow(false)
  }, [])

  const handleJump = id => {
    setShowFollow(false)
    props.history.push(`/user/${id}`)
  }

  const handlePullDown = () => {
    if(id !== 0) {
      if(type === 1) {
        getFollowListDispatch(id)
      } else {
        getFollowedListDispatch(id)
      }
    }
  }

  const handlePullUp = () => {
    if(more) {
      if(type === 1) {
        getMoreFollowListDispatch()
      } else {
        getMoreFollowedListDispatch()
      }
    }
  }

  return (
    <CSSTransition
      in={showFollow}
      timeout={300}
      classNames="follow-swipe"
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container play={playing}>
        <Header
          title={type === 1 ? '关注' : '粉丝'}
          handleClick={handleBack}
          isDark={true}
        ></Header>
        <ListWrapper>
          <Scroll 
            bounceTop={true} 
            enterLoading={loading} 
            onScroll={forceCheck}
            pullUp={handlePullUp}
            pullDown={handlePullDown}
            >
            <div>
              {
                list.map(item => {
                  return (
                  <div className="item" key={item.userId} onClick={() => handleJump(item.userId)}>
                    <div className="img-wrapper">
                      <LazyLoad overflow placeholder={<img src={require('./defaultAvatar.jpg')} width="100%" height="100%" alt="avatar" />} >
                        <img src={item.avatarUrl} width="100%" height="100%" alt="avatar" />
                        {
                          item.avatarDetail ? 
                          <img className="img-detail-icon" src={item.avatarDetail.identityIconUrl} alt="" />
                          : null
                        }
                      </LazyLoad>
                    </div>
                    
                    <div className="text">
                      <h5>{item.nickname}</h5>
                    </div>
                  </div>
                  )
                })
              }
            </div>
            
          </Scroll>
        </ListWrapper>
        
      </Container>
      
    </CSSTransition>
    
  )
}

const mapStateToProps = state => ({
  ...state['follow'],
  playing: state['player']['playList'].length
})

const mapDispatchToProps = dispatch => ({
  getFollowListDispatch(id) {
    dispatch(getFollowList(id))
  },
  getFollowedListDispatch(id) {
    dispatch(getFollowedList(id))
  },
  getMoreFollowListDispatch() {
    dispatch(getMoreFollowList())
  },
  getMoreFollowedListDispatch() {
    dispatch(getMoreFollowedList())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Follow)) 