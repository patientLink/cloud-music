import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react'
import {CSSTransition} from 'react-transition-group'
import {Container, ImgWrapper, CollectButton, SongListWrapper, BgLayer} from './style'
import Header from '../../baseUI/header'
import Scroll from '../../baseUI/scroll'
import SongsList from '../SongsList'
import {HEADER_HEIGHT} from './../../api/config'
import {connect} from 'react-redux'
import {getSingerInfo, changeEnterLoading} from './store/actionCreators'
import {collectArtistAndRefresh} from '../Login/store/actionCreators'
import MusicNote from '../../baseUI/music-note'

function Singer(props) {
  const [showStatus, setShowStatus] = useState(true)

  const {
    artist,
    songsOfArtist: songs,
    loading,
    songsCount,
    userSublist
  } = props

  const {getSingerDataDispatch, collectArtistDispatch} = props

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

  const id = props.match.params.id

  useEffect(() => {
    // const id = props.match.params.id
    setShowStatus(true)
    getSingerDataDispatch(id)
    clientWidthRatio.current = document.documentElement.clientWidth / 375
    songScroll.current && songScroll.current.refresh()
  }, [id])

  useEffect(() => {
    let h = imageWrapper.current.offsetHeight
    songScrollWrapper.current.style.top = `${h - OFFSET}px`
    initialHeight.current = h
    layer.current.style.top = `${h - OFFSET}px`
    songScroll.current.refresh()
  }, [])

  const collected = useMemo(() => userSublist.map(item => item.id).find(item => item === artist.id), [userSublist, artist])

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({x, y})
  }

  const handleGoBack = useCallback(() => {
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
      onExited={props.history.goBack}
    >
      <Container play={songsCount}>
        <Header 
          handleClick={handleGoBack}
          title={artist.name}
          ref={header}
        ></Header>
        <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
          <div className="filter"></div>
        </ImgWrapper>
        <CollectButton ref={collectButton} onClick={() => {collectArtistDispatch(collected ? 2 : 1, artist.id)}}>
          {
            collected ? 
            <>
              <i className="iconfont">&#xe8c3;</i>
              <span className="text"> 已收藏 </span>
            </>
             : 
            <>
              <i className="iconfont">&#xe61b;</i>
              <span className="text"> 收藏 </span>
            </>
          }
        </CollectButton>
        <BgLayer ref={layer}></BgLayer>
        <SongListWrapper ref={songScrollWrapper}>
          <Scroll onScroll={handleScroll} ref={songScroll} enterLoading={loading}>
            <SongsList 
              songs={songs}
              trackCount={songs.length}
              showCollect={false} 
              musicAnimation={musicAnimation}
            ></SongsList>
          </Scroll>
        </SongListWrapper>
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  ...state['singerInfo'],
  songsCount: state['player']['playList'].length,
  userSublist: state['user']['userSublist']
})

const mapDispatchToProps = dispatch => ({
  getSingerDataDispatch(id) {
    dispatch(changeEnterLoading(true))
    dispatch(getSingerInfo(id))
  },
  collectArtistDispatch(t, id) {
    dispatch(collectArtistAndRefresh(t, id))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singer)) 