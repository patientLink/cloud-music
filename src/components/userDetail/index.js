import React, { useEffect, useState } from 'react'
import {Container, Block} from './style'
import {getCount} from '../../api/utils'

function UserDetail(props) {
  const {state, playlist} = props
  const {handleRefresh, handleJump} = props
  const [createList, setCreateList] = useState([])
  const [collectList, setCollectList] = useState([])
  const [countTotalCollect, setCountTotalCollect] = useState(0)
  
  useEffect(() => {
    if(playlist.length) {
      let a = [], b = [], count = 0
      playlist.forEach((item, index) => {
        if(index === 0) {
          return
        }
        if(item.userId === state.profile.userId) {
          a.push(item)
        }else {
          b.push(item)
        }
      })
      setCreateList(a)
      setCollectList(b)
      if(a.length > 0) {
        count = a.reduce((acc, cur) => {
          return acc + cur['subscribedCount']
        }, 0)
      }
      setCountTotalCollect(count)
    }
  }, [playlist, state.profile.userId])

  useEffect(() => {
    handleRefresh()
  }, [createList, collectList, countTotalCollect, handleRefresh])

  return (
    <Container>
      <div className="content-list">
        <div className="item btn-to-deep">
          <div className="iconfont icon rank">&#xe60a;</div>
          <div className="text">
            <h5>{state['profile'] && state['profile']['nickname']}的听歌排行</h5>
            <h6>累计听歌{state['listenSongs']}首</h6>
          </div>
        </div>
        <div className="item btn-to-deep" onClick={() => handleJump(playlist[0].id)}>
          <div className="iconfont icon like">&#xe8c3;</div>
          <div className="text">
            <h5>{state['profile'] && state['profile']['nickname']}喜欢的音乐</h5>
            <h6>{playlist.length>0 ? playlist[0]['trackCount'] : '0'}首，播放{playlist.length>0 ? getCount(playlist[0]['playCount']) : '0'}次</h6>
          </div>
        </div>
      </div>
      {
        createList.length > 0 ? 
        <Block>
          <div className="title">
            创建的歌单
            <span className="sub-title">（{createList.length}个，被收藏{getCount(countTotalCollect)}次）</span>
          </div>
          <div className="content-list">
            {
              createList.map((item, index) => {
                return (
                  <div className="item btn-to-deep" key={item['id']} onClick={() => handleJump(item.id)}>
                    <img src={item['coverImgUrl']} className="icon" alt='' />
                    <div className="text">
                      <h5>{item['name']}</h5>
                      <h6>{item['trackCount']}首，播放{getCount(item['playCount'])}次</h6>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </Block> : ''
      }
      {
        collectList.length > 0 ? 
        <Block>
          <div className="title">
            收藏的歌单
            <span className="sub-title">（{collectList.length}）</span>
          </div>
          <div className="content-list">
            {
              collectList.map((item, index) => {
                return (
                  <div className="item btn-to-deep" key={item['id']} onClick={() => handleJump(item.id)}>
                    <img src={item['coverImgUrl']} className="icon" alt="coverImg" />
                    <div className="text">
                      <h5>{item['name']}</h5>
                      <h6>{item['trackCount']}首，by {item['creator']['nickname']}，播放{getCount(item['playCount'])}次</h6>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </Block> : ''
      }
      
    </Container>
  )
}

export default React.memo(UserDetail)