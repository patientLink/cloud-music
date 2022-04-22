import React, {useEffect, useRef, useState} from 'react'
import {CommentCard, CommentsListWrapper, ContentArea, TypeBar, IntroBlock} from './style'
import {CSSTransition} from 'react-transition-group'
import {connect} from 'react-redux'
import { 
  getFirstPageCommentsList, 
  loadMoreComments,
  toggleShowCommentsList  ,
  changeCommentsList
} from './store/actionCreators'
import { changeFullScreen } from '../Player/store/actionCreators'
import { operateChooseSinger } from '../../components/OperationsList/store/actionCreators'
import Header from '../../baseUI/header'
import Scroll from '../../baseUI/scroll'
import dayjs from 'dayjs'
import {withRouter} from 'react-router-dom'
import {
  getSongDetailRequest,
  getAlbumDetailRequest,
  likeComment
} from '../../api/request'
import {getName} from '../../api/utils'
import LazyLoad, {forceCheck} from 'react-lazyload'
import Calendar from 'dayjs/plugin/calendar'
import 'dayjs/locale/zh-cn'

dayjs.extend(Calendar)
dayjs.locale('zh-cn')

const calendarString = {
  sameDay: 'HH:mm', // The same day ( Today at 2:30 AM )
  lastDay: '[昨天] HH:mm', // The day before ( Yesterday at 2:30 AM )
  lastWeek: 'MM/DD', // Last week ( Last Monday at 2:30 AM )
  sameElse: 'YYYY[年]MM[月]DD[日]' // Everything else ( 7/10/2011 )
}

function CommentsList (props) {
  const {
    list,
    totalCount,
    pageNo,
    sortType,
    cursor,
    loading,
    showCommentsList,
    playing,
    type,
    id
  } = props

  const {
    getFirstCommentsDispatch,
    loadMoreCommentsDispatch,
    toggleShowCommentsDispatch,
    toggleFullScreenDispatch,
    changeCommentsListLikeDispatch,
    operateChooseSingerDispatch
  } = props

  const scrollRef = useRef()
  const [commentsInfo, setCommentsInfo] = useState({
    title: '',
    imgSrc: '',
    author: '',
    artistsList: [],
    type: 0 // 0-歌手 1-歌单创建者
  })

  useEffect(() => { // 初次进入评论页
    const params = props.match.params.id
    let [urlId, type] = params.split('+')
    type = Number(type)
    toggleShowCommentsDispatch(true)
    getFirstCommentsDispatch(urlId, type, 99)
  }, [])

  useEffect(() => { // 停留在评论页时切歌
      handleGetInfo(id, type)
  }, [id])

  const handleGetInfo = (id, type) => {
    switch(type) {
      case 0: // 歌曲
        getSongDetailRequest(id)
        .then(res => {
          if(res.code === 200) {
            setCommentsInfo({
              title: res.songs[0].name,
              imgSrc: res.songs[0].al.picUrl,
              author: getName(res.songs[0].ar),
              artistsList: res.songs[0].ar,
              type: 0
            })
          }
        })
        .catch(err => {})
        break
      case 2: // 歌单
        getAlbumDetailRequest(id)
        .then(res => {
          if(res.code === 200) {
            setCommentsInfo({
              title: res.playlist.name,
              imgSrc: res.playlist.coverImgUrl,
              author: getName(res.playlist.creator.nickname),
              artistsList: [res.playlist.creator.userId],
              type: 1
            })
          }
        })
        break
      default:
    }
  }

  const handleChangeType = (i) => {
    getFirstCommentsDispatch(id, type, i)
    scrollRef.current.refresh()
  }

  const handleJump = (id) => {
    toggleShowCommentsDispatch(false)
    props.history.push(`/user/${id}`)
  }

  const handleJumpToSingerPage = () => {
    if(commentsInfo.artistsList.length === 1) {
      if(commentsInfo.type === 0) {
        props.history.push(`/singers/${commentsInfo.artistsList[0].id}`)
      } else {
        props.history.push(`/user/${commentsInfo.artistsList[0]}`)
      }
    } else {
      console.log(commentsInfo.artistsList)
      operateChooseSingerDispatch(commentsInfo.artistsList)
    }
    
  }

  const handleLikeComment = (cid, t) => {
    likeComment(id, cid, t, type)
    .then(res => {
      if(res.code === 200) {
        let newList = list.map(item => {
          if(item.commentId === cid) {
            return {...item, liked: t ? true : false, likedCount: item.likedCount + (t ? 1 : (-1))}
          }
          return {...item}
        })
        changeCommentsListLikeDispatch(newList)
      }
    })
  }

  const loadMoreCommentsList = () => {
    loadMoreCommentsDispatch(id, type, pageNo+1, sortType, cursor)
  }

  return (
    <CSSTransition
      in={showCommentsList}
      timeout={300}
      classNames="list-swipe"
      unmountOnExit
      onExited={props.history.goBack}
    >
      <CommentsListWrapper
        style={showCommentsList ? {display: "block"} : {display: "none"}}
      >
        <Header 
          handleClick={() => {
            if(playing) {
              toggleFullScreenDispatch(true)
            }
            toggleShowCommentsDispatch(false)
          }} 
          title={`评论(${totalCount})`}
          isDark={true}
          />
        <IntroBlock className="btn-to-deep">
          <img src={commentsInfo.imgSrc} alt="img" />
          <div className="comments-title">
            <h5>{commentsInfo.title}</h5>
            <h6 onClick={handleJumpToSingerPage}>{commentsInfo.author}</h6>
          </div>
        </IntroBlock>
        <TypeBar>
          {
            ['推荐','最热','最新'].map((item, index) => {
              return (
                <div onClick={() => handleChangeType(index+1)} key={index}>
                  <span className={index === (sortType-1) % 98 ? 'selected' : ''}> 
                    {item}
                  </span>
                </div>
              )
            })
          }
        </TypeBar>
        <ContentArea>
          <Scroll 
            direction="vertical"
            bounceTop={false}
            enterLoading={loading}
            pullUp={loadMoreCommentsList}
            onScroll={forceCheck}
            ref={scrollRef}
          >
            <div>
              {
                list && list.length>0 ?
                list.map((item, index) => {
                  return (
                    <CommentCard className="btn-to-deep" key={item.commentId+index}>
                      <div className="left">
                        <div className="img_wrapper">
                          <LazyLoad overflow placeholder={<img src={require('./defaultAvatar.jpg')} height="100%" width="100%" alt="avatar" />}>
                            <img src={item.user.avatarUrl} width="100%" height="100%" onClick={() => handleJump(item.user.userId)} alt="avatar"/>
                          </LazyLoad>
                        </div>
                      </div>
                      <div className="right">
                        <p className="nickname">{item.user.nickname}</p>
                        <time>{dayjs(item.time).calendar(null, calendarString) }</time>
                        <p className="content">{item.content}</p>
                      </div>
                      <div className="liked">
                        <span className="liked-count">{item.likedCount > 0 ? item.likedCount : ''}  </span>
                        {
                          item.liked ? 
                          <span className="iconfont like" onClick={() => handleLikeComment(item.commentId, 0)}>&#xe8c4;</span> : 
                          <span className="iconfont" onClick={() => handleLikeComment(item.commentId, 1)}>&#xe8ad;</span>
                        }
                      </div>
                    </CommentCard>
                  )
                }) :
                <div>评论君罢工了~</div>
              }
            </div>
            
          </Scroll>
        </ContentArea>
      </CommentsListWrapper>
    </CSSTransition>
    
  )
}

const mapStateToProps = state => ({
  ...state['comments'],
  playing: state['player']['playList'].length
})

const mapDispatchToProps = dispatch => ({
  getFirstCommentsDispatch(id, type, sortType) {
    dispatch(getFirstPageCommentsList(id, type, sortType))
  },
  loadMoreCommentsDispatch(id, type, page, sortType, cursor) {
    dispatch(loadMoreComments(id, type, page, sortType, cursor))
  },
  toggleShowCommentsDispatch(data) {
    dispatch(toggleShowCommentsList(data))
  },
  toggleFullScreenDispatch(data) {
    dispatch(changeFullScreen(data))
  },
  changeCommentsListLikeDispatch(data) {
    dispatch(changeCommentsList(data))
  },
  operateChooseSingerDispatch(data) {
    dispatch(operateChooseSinger(data))
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(React.memo(withRouter(CommentsList)))