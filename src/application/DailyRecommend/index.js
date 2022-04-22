import React, {useState, useRef, useEffect, useCallback} from 'react'
import {
  Container, 
  TopDesc,
} from './style'
import {CSSTransition} from 'react-transition-group'
import Header from '../../baseUI/header'
import Scroll from '../../baseUI/scroll'
import { getRecommendSongs } from '../../api/request'
import globalStyle from '../../assets/global-style'
import {connect} from 'react-redux'
import SongsList from '../SongsList'
import {HEADER_HEIGHT} from '../../api/config'
import MusicNote from '../../baseUI/music-note'

function DailyRecommend(props) {
  const [showStatus, setShowStatus] = useState(true)
  const [isMarquee, setIsMarquee] = useState(false)
  const [songlist, setSonglist] = useState([])
  const [enterLoading, setEnterLoading] = useState(true)

  const headerEl = useRef()
  const musicNoteRef = useRef()

  const {songsCount} = props

  useEffect(() => {
      getRecommendSongs()
      .then(res => {
          if(res.code === 200) {
              setSonglist(res.data.dailySongs)
              setEnterLoading(false)
          }
      })
  }, [])

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({x, y})
  }

  const handleBack = useCallback(() => {
    setShowStatus(false)
  }, [])

  const handleScroll = useCallback((pos) => {
    let minScrollY = -HEADER_HEIGHT
    let percent = Math.abs(pos.y / minScrollY)
    let headerDom = headerEl.current
    if(pos.y < minScrollY) {
      headerDom.style.backgroundColor = globalStyle["theme-color"]
      headerDom.style.opacity = Math.min(1, (percent-1)/2)
      setIsMarquee(true)
    } else {
      headerDom.style.backgroundColor = ""
      headerDom.style.opacity = 1
      setIsMarquee(false)
    }
  }, [])
  const renderTopDesc = () => {
    return (
      <TopDesc>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={require('./calendar.png')} alt="calendar_icon" />
        </div>
        <div className="desc_wrapper">
          <div className="title">
            <p>每日歌曲推荐</p>
            <span>根据你的音乐口味生成，每天6:00更新</span>
          </div>
        </div>
      </TopDesc>
    )
  }
  return (
    <CSSTransition
      in={showStatus}
      timeout={400}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container play={songsCount}>
        <Header 
          ref={headerEl} 
          title="每日歌曲推荐" 
          handleClick={handleBack}
          isMarquee={isMarquee}
          ></Header>
        {
          songlist.length ? (
            <Scroll bounceTop={false} onScroll={handleScroll} enterLoading={enterLoading}>
              <div>
                {renderTopDesc()}
                <SongsList 
                  songs={songlist}
                  trackCount={songlist.length}
                  showBackground={true}
                  musicAnimation={musicAnimation}
                ></SongsList>
              </div>
            </Scroll>
          ) : null
        }
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  songsCount: state['player']['playList'].length
})

export default connect(mapStateToProps)(React.memo(DailyRecommend))