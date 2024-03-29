import React, {useRef} from 'react'
import { CSSTransition } from 'react-transition-group'
import {getName} from '../../../api/utils'
import {MiniPlayerContainer} from './style'
import ProgressCircle from '../../../baseUI/progress-circle'

function MiniPlayer(props) {
  const {song, fullScreen, playing, percent, isPersonalFm} = props
  const {toggleFullScreen, clickPlaying, togglePlayList} = props
  const miniPlayerRef = useRef()

  const handleTogglePlayList = (e) => {
    e.stopPropagation()
    togglePlayList(true)
  }

  return (
    <CSSTransition
      in={!fullScreen}
      timeout={400}
      classNames="mini"
      onEnter={() => {
        miniPlayerRef.current.style.display = "flex"
      }}
      onExited={() => {
        miniPlayerRef.current.style.display = "none"
      }}
    >
      <MiniPlayerContainer ref={miniPlayerRef} onClick={() => {
          toggleFullScreen(true)
        }}>
        <div className="icon">
          <div className="imgWrapper">
            <img 
              className={`play ${playing ? "" : "pause"}`} 
              src={isPersonalFm ? song.album.picUrl : song.al.picUrl} 
              alt="img" />
          </div>
        </div>
        <div className="text">
          <h2 className="name">{song.name}</h2>
          <p className="desc">{isPersonalFm ? getName(song.artists) : getName(song.ar)}</p>
        </div>
        <div className="control">
          <ProgressCircle radius={32} percent={percent}>
            {
              playing ? 
              <i className="icon-mini iconfont icon-pause" onClick={e => clickPlaying(e, false)}>&#xe618;</i> 
              :
              <i className="icon-mini iconfont icon-play" onClick={e => clickPlaying(e, true)}>&#xe65d;</i>
            }
          </ProgressCircle>
          
        </div>
        <div className="control" >
          <i className="iconfont" onClick={handleTogglePlayList}>&#xe613;</i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
    
  )
}

export default React.memo(MiniPlayer)