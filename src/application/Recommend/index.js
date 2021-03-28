import React, {useEffect} from 'react'
import Slider from '../../components/slider'
import RecommendList from '../../components/list'
import {Content} from './style'
import Scroll from '../../baseUI/scroll'
import * as actionTypes from './store/actionCreators'
import {connect} from 'react-redux'
import {forceCheck} from 'react-lazyload'
import {renderRoutes} from 'react-router-config'

function Recommend(props) {

  const {bannerList, recommendList, enterLoading, songsCount} = props
  const {getBannerDataDispatch, getRecommendListDataDispatch} = props

  useEffect(() => {
    !bannerList.length && getBannerDataDispatch()
    !recommendList.length && getRecommendListDataDispatch()
    console.log(props)
  }, [])

  return (
    <Content play={songsCount}>
      <Scroll className="list" onScroll={forceCheck} enterLoading={enterLoading}>
          <div>
            <Slider bannerList={bannerList}></Slider>
            <RecommendList recommendList={recommendList}></RecommendList>
          </div>
      </Scroll>
      {renderRoutes(props.route.routes)}
    </Content>
    
    
  )
}

const mapStateToProps = (state) => ({
  bannerList: state["recommend"]["bannerList"],
  recommendList: state["recommend"]["recommendList"],
  enterLoading: state["recommend"]["enterLoading"],
  songsCount: state["player"]["playList"].length
})

const mapDispatchToProps = (dispatch) => ({
  getBannerDataDispatch() {
    dispatch(actionTypes.getBannerList())
  },
  getRecommendListDataDispatch() {
    dispatch(actionTypes.getRecommendList())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend))