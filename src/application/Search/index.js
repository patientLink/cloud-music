import React, {useState, useEffect, useCallback, useRef} from 'react'
import {CSSTransition} from 'react-transition-group'
import {Container, ShortcutWrapper, HotKey, List, ListItem, SongItem} from './style'
import SearchBox from '../../baseUI/search-box'
import {connect} from 'react-redux'
import { changeEnterLoading, getHotKeyWords, getSuggestList } from './store/actionCreators'
import {getSongDetail} from '../Player/store/actionCreators'
import Scroll from '../../baseUI/scroll'
import LazyLoad, { forceCheck } from 'react-lazyload'
import {getName} from '../../api/utils'
import MusicNote from '../../baseUI/music-note'

function Search(props) {

  const {
    hotList,
    enterLoading,
    suggestList,
    songsCount,
    songsList
  } = props

  const {
    getHotKeyWordsDispatch,
    changeEnterLoadingDispatch,
    getSuggestListDispatch,
    getSongDetailDispatch
  } = props

  const [show, setShow] = useState(false)
  const [query, setQuery] = useState('')

  const musicNoteRef = useRef()

  const searchBack = useCallback(() => {
    setShow(false)
  }, [])
  const handleQuery = useCallback(q => {
    if(!q) {
      setQuery('')
      return
    } 
    setQuery(q)
    changeEnterLoadingDispatch(true)
    getSuggestListDispatch(q)
  }, [])
  const selectItem = (e, id) => {
    getSongDetailDispatch(id)
    musicNoteRef.current.startAnimation({
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY
    })
  }
  useEffect(() => {
    console.log(props)
    setShow(true)
    if(!hotList.length) {
      getHotKeyWordsDispatch()
    }
  }, [])

  // 搜索框为空，展示热门搜索列表
  const renderHotKey = () => {
    let list = hotList || []
    return (
      <ul>
        {
          list.map((item) => {
            return (
              <li className="item" key={item.first} onClick={() => setQuery(item.first)}>
                <span>{item.first}</span>
              </li>
            )
          })
        }
      </ul>
    )
  }

  const renderSingers = () => {
    let singers = suggestList.artists
    if(!singers || !singers.length) return 
    return (
      <List>
        <h1 className="title">相关歌手</h1>
        {
          singers.map((item, index) => {
            return (
              <ListItem key={item.accountId+""+index} onClick={() => props.history.push(`/singers/${item.id}`)}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')} />}>
                    <img src={item.picUrl || require('./singer.png')} width="100%" height="100%" alt="music" />  
                  </LazyLoad>
                </div>
                <span className="name">歌手: {item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  }
  const renderAlbum = () => {
    let albums = suggestList.albums
    let playlists = suggestList.playlists
    if(!playlists || !playlists.length) return
    // if((!albums || !albums.length) && (!playlists || !playlists.length) ) return
    return (
      <List>
        {/* {
          albums && albums.length > 0 ? 
          <React.Fragment>
            <h1 className="title">相关专辑</h1>
            {
              albums.map((item, index) => {
                return (
                  <ListItem key={item.copyrightId + "" + index} onClick={() => props.history.push(`/album/${item.id}`)}>
                    <div className="img_wrapper">
                      <LazyLoad placeholder={<img width="100%" height="100%" src={require('./music.png')} alt="music" />}>
                        <img src={item.coverImgUrl || require('./music.png')} width="100%" height="100%" alt="music"/>
                      </LazyLoad>
                    </div>
                    <span className="name">{item.name}</span>
                  </ListItem>
                )
              })
            }
          </React.Fragment> : ''
        } */}
        {
          playlists && playlists.length > 0 ? 
          <React.Fragment>
            <h1 className="title">相关歌单</h1>
            {
              playlists.map((item, index) => {
                return (
                  <ListItem key={item.copyrightId + "" + index} onClick={() => props.history.push(`/album/${item.id}`)}>
                    <div className="img_wrapper">
                      <LazyLoad placeholder={<img width="100%" height="100%" src={require('./music.png')} alt="music" />}>
                        <img src={item.coverImgUrl || require('./music.png')} width="100%" height="100%" alt="music"/>
                      </LazyLoad>
                    </div>
                    <span className="name">{item.name}</span>
                  </ListItem>
                )
              })
            }
          </React.Fragment> : ''
        }
      </List>
    )
  }
  const renderSongs = () => {
    return (
      <SongItem> 
        {
          songsList.map(item => {
            return (
              <li key={item.id} onClick={e => selectItem(e, item.id)}>
                <div className="info">
                  <span>{item.name}</span>
                  <span>
                    { getName(item.artists) } - { item.album.name }
                  </span>
                </div>
              </li>
            )
          })
        }
      </SongItem>
    )
  }



  return (
    <CSSTransition
      in={show}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <Container play={songsCount}>
        <div className="search_box_wrapper">
          <SearchBox back={searchBack} newQuery={query} handleQuery={handleQuery}></SearchBox>
        </div>
        <ShortcutWrapper show={!query}>
          <Scroll>
            <div>
              <HotKey>
                <h1 className="title">热门搜索</h1>
                {renderHotKey()}
              </HotKey>
            </div>
          </Scroll>
        </ShortcutWrapper>
        <ShortcutWrapper show={query}>
          <Scroll onScroll={forceCheck} enterLoading={enterLoading}>
            <div>
              {renderSingers()}
              {renderAlbum()}
              {renderSongs()}
            </div>
          </Scroll>
        </ShortcutWrapper>
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  ...state['search'],
  songsCount: state['player']['playList'].length
})

const mapDispatchToProps = dispatch => ({
  getHotKeyWordsDispatch() {
    dispatch(getHotKeyWords())
  },
  changeEnterLoadingDispatch(data) {
    dispatch(changeEnterLoading(data))
  },
  getSuggestListDispatch(data) {
    dispatch(getSuggestList(data))
  },
  getSongDetailDispatch(id) {
    dispatch(getSongDetail(id))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Search)) 