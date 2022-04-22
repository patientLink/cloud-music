import React from 'react'
import {SongList, SongItem} from './style'
import {getName} from '../../api/utils'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {
  changePlayList, 
  changeCurrentIndex, 
  changeSequencePlayList,
  resetPlayer
} from '../Player/store/actionCreators'
import { 
  changeOperationListShow,
  operateSong
} from '../../components/OperationsList/store/actionCreators'

const SongsList = React.forwardRef((props, ref) => {
  const {
    songs,
    isFmMode,
    trackCount
  } = props
  const {
    changePlayListDispatch, 
    changeCurrentIndexDispatch, 
    changeSequencePlayListDispatch,
    toggleOperationListShowDispatch,
    operateSongDispatch,
    clearDispatch
  } = props
  const {musicAnimation} = props
  
  // const totalCount = songs.length


  const handleJumpToVideo = item => {
    console.log(item.mv)
  }

  const handleMoreOperation = item => {
    operateSongDispatch(item.id)
    toggleOperationListShowDispatch(true)
  }

  const selectItem = (e, index) => {
    if(isFmMode) {
      clearDispatch()
    }
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
        <li className="btn-to-deep" key={item.id} onClick={(e) => selectItem(e, i)}>
          <span className="index">{i+1}</span>
          <div className="info">
            <span className="info_name">{item.name}</span>
            <span className="info_detail">
              {
                item.fee === 1 ? 
                <i className="tips tips-vip">VIP</i> 
                :
                item.fee === 8 ? 
                <i className="tips tips-vip">SQ</i> 
                : null
              }
              {item.ar ? getName(item.ar) : getName(item.artists)} - {item.al ? item.al.name : item.album.name}
            </span>
            <span className="info_opt">
              {
                item.mv ? 
                <i 
                  className="iconfont iconfont-btn iconfont-btn_video btn-to-deep" 
                  onClick={(e) => { 
                    e.stopPropagation()
                    handleJumpToVideo(item)
                  }}>&#xe600;</i> : null
              }
              <i 
                className="iconfont iconfont-btn iconfont-btn_more btn-to-deep" 
                onClick={(e) => {
                  e.stopPropagation()
                  handleMoreOperation(item)
                }}>&#xe608;</i>
            </span>
          </div>
        </li>
      )
    }
    return res
  }

  return (
    <SongList ref={ref} showBackground={props.showBackground}>
      <div className="first_line btn-to-deep">
        <div className="play_all" onClick={(e) => selectItem(e, 0)}>
          <i className="iconfont">&#xe612;</i>
          <span>播放全部 <span className="sum">(共{trackCount}首)</span></span>
        </div>
      </div>
      <SongItem>
        {songList(songs)}
      </SongItem>
    </SongList>
  )
})

SongsList.propTypes = {
  songs: PropTypes.array,
  showBackground: PropTypes.bool
}

const mapStateToProps = state => ({
  isFmMode: state['player']['isPersonalFm']
})

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
  clearDispatch() {
    dispatch(resetPlayer())
  },
  toggleOperationListShowDispatch(data) {
    dispatch(changeOperationListShow(data))
  },
  operateSongDispatch(data) {
    dispatch(operateSong(data))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(SongsList))