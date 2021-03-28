import React, {useState, useRef, useEffect, useCallback} from 'react'
import {CSSTransition} from 'react-transition-group'
import {Container, ImgWrapper, CollectButton, SongListWrapper, BgLayer} from './style'
import Header from '../../baseUI/header'
import Scroll from '../../baseUI/scroll'
import SongsList from '../SongsList'
import {HEADER_HEIGHT} from './../../api/config'
import {connect} from 'react-redux'
import {getSingerInfo, changeEnterLoading} from './store/actionCreators'
import MusicNote from '../../baseUI/music-note'

function Singer(props) {
  const [showStatus, setShowStatus] = useState(true)

  const {artist, songsOfArtist: songs, loading, songsCount} = props

  const {getSingerDataDispatch} = props

  const collectButton = useRef()
  const imageWrapper = useRef()
  const songScrollWrapper = useRef()
  const songScroll = useRef()
  const header = useRef()
  const layer = useRef()
  const musicNoteRef = useRef()
  const clientWidthRatio = useRef()

  const initialHeight = useRef(0)
  const OFFSET = 5

  useEffect(() => {
    const id = props.match.params.id
    getSingerDataDispatch(id)
    clientWidthRatio.current = document.documentElement.clientWidth / 375
  }, [])

  useEffect(() => {
    let h = imageWrapper.current.offsetHeight
    songScrollWrapper.current.style.top = `${h - OFFSET}px`
    initialHeight.current = h
    layer.current.style.top = `${h - OFFSET}px`
    songScroll.current.refresh()

  }, [])

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({x, y})
  }

  const setShowStatusFalse = useCallback(() => {
    setShowStatus(false)
  }, [])

  const handleScroll = useCallback(pos => {
    let height = initialHeight.current
    const newY = pos.y
    const imageDOM = imageWrapper.current
    const buttonDOM = collectButton.current
    const headerDOM = header.current
    const layerDOM = layer.current
    const minScrollY = -(height - OFFSET * clientWidthRatio.current) + HEADER_HEIGHT * clientWidthRatio.current
    const percent = Math.abs(newY / height)

    if(newY > 0) {
      imageDOM.style["transform"] = `scale(${1+percent})`
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`
      layerDOM.style.top = `${height - OFFSET * clientWidthRatio.current + newY}px`
    } else if (newY >= minScrollY) {
      layerDOM.style.top = `${height - OFFSET * clientWidthRatio.current - Math.abs(newY)}px`
      layerDOM.style.zIndex = 1
      imageDOM.style.paddingTop = "75%"
      imageDOM.style.height = 0
      imageDOM.style.zIndex = -1

      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`
      buttonDOM.style["opacity"] = `${1 - percent * 2}`
    } else if (newY < minScrollY) {
      layerDOM.style.top = `${(HEADER_HEIGHT - OFFSET) * clientWidthRatio.current}px`
      layerDOM.style.zIndex = 1
      headerDOM.style.zIndex = 100
      imageDOM.style.height = `${HEADER_HEIGHT * clientWidthRatio.current}px`
      imageDOM.style.paddingTop = 0
      imageDOM.style.zIndex = 99
    }
  }, [])


  return (
    <CSSTransition
      in={showStatus}
      timeout={400}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={() => props.history.goBack ()}
    >
      <Container play={songsCount}>
        <Header 
          handleClick={setShowStatusFalse}
          title={artist.name}
          ref={header}
        ></Header>
        <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
          <div className="filter"></div>
        </ImgWrapper>
        <CollectButton ref={collectButton}>
          <i className="iconfont">&#xe61b;</i>
          <span className="text"> 收藏 </span>
        </CollectButton>
        <BgLayer ref={layer}></BgLayer>
        <SongListWrapper ref={songScrollWrapper}>
          <Scroll onScroll={handleScroll} ref={songScroll} enterLoading={loading}>
            <SongsList songs={songs} showCollect={false} musicAnimation={musicAnimation}></SongsList>
          </Scroll>
        </SongListWrapper>
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  ...state['singerInfo'],
  songsCount: state['player']['playList'].length
})

const mapDispatchToProps = dispatch => ({
  getSingerDataDispatch(id) {
    dispatch(changeEnterLoading(true))
    dispatch(getSingerInfo(id))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singer)) 