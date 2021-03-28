import React, { useContext, useEffect, useMemo, useState } from 'react'
import Horizon from '../../baseUI/horizon-item'
import {categoryTypes, alphaTypes} from '../../api/config'
import {
  NavContainer,
  List,
  ListContainer,
  ListItem
} from './style'
import Scroll from '../../baseUI/scroll'
import LazyLoad, {forceCheck} from 'react-lazyload'
import {
  getSingerList,
  getHotSingerList,
  changeEnterLoading,
  changePageCount,
  changePullUpLoading,
  changePullDownLoading,
  refreshMoreSingerList,
  refreshMoreHotSingerList
} from './store/actionCreators'
import {connect} from 'react-redux'
import { CategoryDataContext, CHANGE_ALPHA, CHANGE_CATEGORY } from './data'
import {renderRoutes} from 'react-router-config'


function Singers(props) {
  // let [category, setCategory] = useState({type: '', area: ''})
  // let [alpha, setAlpha] = useState('')
  const {data, dispatch} = useContext(CategoryDataContext)
  const {area, type, alpha} = data
  const {
    singerList, 
    pageCount, 
    enterLoading, 
    pullUpLoading, 
    pullDownLoading, 
    songsCount
  } = props
  const {
    updateDispatch, 
    getHotSingerDispatch,
    pullUpRefreshDispatch,
    pullDownRefreshDispatch
  } = props

  // 真实列表数量为12条
  // const [startIndex, setStartIndex] = useState(0)
  // const [endIndex, setEndIndex] = useState(11)

  let updateAlphaHandle = (val) => {
    const {key} = val
    dispatch({type: CHANGE_ALPHA, data: key})
    if(type === '' && area === '') {
      dispatch({type: CHANGE_CATEGORY, data: {type: '-1', area: '-1'}})
      updateDispatch('-1', '-1', key)
    } else {
      updateDispatch(type, area, key)
    }
    
  }
  let updateCategoryHandle = (val) => {
    const {type, area} = val
    dispatch({type: CHANGE_CATEGORY, data: {type, area}})
    if(alpha === '') {
      dispatch({type: CHANGE_ALPHA, data: 'a'})
      updateDispatch(type, area, 'a')
    } else {
      updateDispatch(type, area, alpha)
    }
    
  }
  let handlePullUp = () => {
    pullUpRefreshDispatch(type, area, alpha, type === '', pageCount)
  }
  let handlePullDown = () => {
    pullDownRefreshDispatch(type, area, alpha)
  }
  let enterDetail = (id) => {
    props.history.push(`/singers/${id}`)
  }
  const renderSingerList = () => {
    return (
      <List>
        {
          singerList.map((item, index) => {
            return (
              <ListItem 
                key={item.accountId + "" + index}
                onClick={() => enterDetail(item.id)}
                // onClick={(e) => {
                //   e.stopPropagation()
                // }}
                >
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')} alt="music" />}>
                    <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="singer" />
                  </LazyLoad>
                </div>
                <span className="name">{item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  }

  useEffect(() => {
    // if(type === '' && area === '' && alpha === '') {
    //   getHotSingerDispatch()
    // } else {
    //   updateDispatch(type, area, alpha)
    // }
    if(!singerList.length) {
      getHotSingerDispatch()
    }
  }, [])

  return (
    <NavContainer>
      <Horizon 
        list={categoryTypes} 
        clickHandle={(val) => updateCategoryHandle(val)} 
        oldVal={{type, area}}
        title="分类 (默认热门):">
      </Horizon>
      <Horizon 
        list={alphaTypes} 
        clickHandle={(val) => updateAlphaHandle(val)}
        oldVal={alpha}
        title="首字母:">
      </Horizon>
      <ListContainer play={songsCount}>
        <Scroll 
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
          enterLoading={enterLoading}
          onScroll={forceCheck}>
          {renderSingerList()}
        </Scroll>
      </ListContainer>
      {renderRoutes(props.route.routes)}
    </NavContainer>
  )
}
const mapStateToProps = (state) => ({
  ...state['singers'],
  songsCount: state['player']['playList'].length
})
const mapDispatchToProps = (dispatch) => ({
  getHotSingerDispatch() {
    dispatch(getHotSingerList())
  },
  updateDispatch(type, area, alpha) {
    dispatch(changePageCount(0))
    dispatch(changeEnterLoading(true))
    dispatch(getSingerList(type, area, alpha))
  },
  pullUpRefreshDispatch(type, area, alpha, hot, count) {
    dispatch(changePullUpLoading(true))
    dispatch(changePageCount(count+1))
    if(hot){
      dispatch(refreshMoreHotSingerList());
    } else {
      dispatch(refreshMoreSingerList(type, area, alpha));
    }
  },
  pullDownRefreshDispatch(type, area, alpha) {
    dispatch(changePullDownLoading(true))
    dispatch(changePageCount(0))
    if(type === '' && area === '' && alpha === '') {
      dispatch(getHotSingerList())
    } else {
      dispatch(getSingerList(type, area, alpha))
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers))