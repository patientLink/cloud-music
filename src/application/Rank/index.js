import React, { useEffect } from 'react'
import {connect} from 'react-redux'
import {getRankList} from './store/actionCreators'
import {filterIndex, getCount} from '../../api/utils'
import {Container, List, ListItem, SongList} from './style'
import Scroll from '../../baseUI/scroll'
import {renderRoutes} from 'react-router-config'

function Rank(props) {

  const {rankList: list, loading, songsCount} = props
  const {getRankListDispatch} = props

  let globalStartIndex = filterIndex(list)
  let officialList = list.slice(0, globalStartIndex)
  let globalList = list.slice(globalStartIndex)

  const enterDetail = (id) => {
    props.history.push(`/rank/${id}`)
  }

  useEffect(() => {
    getRankListDispatch()
  }, [])

  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {
          list.map((item)=> {
            return (
              <ListItem 
                key={item.id}
                tracks={item.tracks}
                onClick={() => enterDetail(item.id)}
                >
                <div className="img_wrapper">
                  <img src={item.coverImgUrl} alt="" />
                  <span className="play_count">
                    <i className="iconfont">&#xe65d;</i>
                    { getCount(item.playCount)}
                  </span>
                  <div className="decorate"></div>
                  <span className="update_frequency">{item.updateFrequency}</span>
                </div>
                {renderSongList(item.tracks)}
              </ListItem>
            )
          })
        }
      </List>
    )
  }

  const renderSongList = (list) => {
    return list.length ? (
      <SongList>
        {
          list.map((item, index) => {
            return <li className="btn-to-deep" key={index}>{index+1}. {item.first} - {item.second}</li>
          })
        }
      </SongList>
    ) : null
  }

  return (
    <Container play={songsCount}>
      <Scroll enterLoading={loading}>
        <div>
          <h1 className="official"> 官方榜 </h1>
          {renderRankList(officialList)}
          <h1 className="global"> 全球榜 </h1>
          {renderRankList(globalList, true)}
        </div>
      </Scroll>
      {renderRoutes(props.route.routes)}
    </Container>
  )
}
const mapStateToProps = (state) => ({
  ...state['rank'],
  songsCount: state['player']['playList'].length
})
const mapDispatchToProps = (dispatch) => ({
  getRankListDispatch() {
    dispatch(getRankList())
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank))