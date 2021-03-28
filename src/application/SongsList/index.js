import React from 'react'
import {SongList, SongItem} from './style'
import {getName} from '../../api/utils'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {changePlayList, changeCurrentIndex, changeSequencePlayList} from '../Player/store/actionCreators'

const SongsList = React.forwardRef((props, ref) => {
  const {collectCount, showCollect, songs} = props
  const {changePlayListDispatch, changeCurrentIndexDispatch, changeSequencePlayListDispatch} = props
  const {musicAnimation} = props
  
  const totalCount = songs.length

  const selectItem = (e, index) => {
    changePlayListDispatch(songs)
    changeSequencePlayListDispatch(songs)
    changeCurrentIndexDispatch(index)
    musicAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY)
  }

  let songList = (list) => {
    let res = []
    for(let i = 0; i < list.length; i++) {
      let item = list[i]
      res.push(
        <li key={item.id} onClick={(e) => selectItem(e, i)}>
          <span className="index">{i+1}</span>
          <div className="info">
            <span>{item.name}</span>
            <span>
              {item.ar ? getName(item.ar) : getName(item.artists)} - {item.al ? item.al.name : item.album.name}
            </span>
          </div>
        </li>
      )
    }
    return res
  }

  const collect = (count) => {
    return (
      <div className="add_list">
        <i className="iconfont">&#xe61b;</i>
        <span> 收藏 ({count})</span>
      </div>
    )
  }

  return (
    <SongList ref={ref} showBackground={props.showBackground}>
      <div className="first_line">
        <div className="play_all" onClick={(e) => selectItem(e, 0)}>
          <i className="iconfont">&#xe612;</i>
          <span>播放全部 <span className="sum">(共{totalCount}首)</span></span>
        </div>
        {showCollect ? collect(collectCount) : null}
      </div>
      <SongItem>
        {songList(songs)}
      </SongItem>
    </SongList>
  )
})



SongsList.propTypes = {
  collectCount: PropTypes.string,
  showCollect: PropTypes.bool,
  songs: PropTypes.array,
  showBackground: PropTypes.bool
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
  }
})

export default connect(null, mapDispatchToProps)(React.memo(SongsList))