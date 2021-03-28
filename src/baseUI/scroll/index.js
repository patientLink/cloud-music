import React, {useMemo, forwardRef, useEffect, useState, useRef, useImperativeHandle, useCallback} from 'react'
import PropTypes from 'prop-types'
import BScroll from 'better-scroll'
import styled from 'styled-px2vw'
import Loading from '../loading'
import LoadingV2 from '../loading-v2'
import {debounce} from '../../api/utils'

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  /* .scroll-inner-container {
    width: 100%;
    position: absolute;
  } */
`

const PullUpLoading = styled.div`
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 5px;
  width: 60px;
  height: 60px;
  margin: auto;
  z-index: 100;
`

const PullDownLoading = styled.div`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  height: 30px;
  margin: auto;
  z-index: 100;
`

const Scroll = forwardRef((props, ref) => {
  const [bScroll, setBScroll] = useState(null)
  const scrollContainerRef = useRef()
  const {direction, click, refresh, bounceTop, bounceBottom} = props // 配置
  const {pullUpLoading, pullDownLoading, enterLoading} = props
  const {pullUp, pullDown, onScroll} = props // 事件

  let pullUpDebounce = useCallback(
    debounce(pullUp, 800)
  , [pullUp])

  let pullDownDebounce = useCallback(
    debounce(pullDown, 800)
  , [pullDown])

  useEffect(() => {
    const scroll = new BScroll(scrollContainerRef.current, {
      scrollX: direction === 'horizontal',
      // scrollX: true,
      scrollY: direction === 'vertical',
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom
      }
    })
    setBScroll(scroll)
    
    return () => {
      setBScroll(null)
    }
  }, [])

  useEffect(() => {
    if(!bScroll || !onScroll) return
    bScroll.on('scroll', (scroll) => {
      onScroll(scroll)
    })
    return () => {
      bScroll.off('scroll')
    }
  }, [onScroll, bScroll])

  useEffect(() => {
    if(!bScroll || !pullUp) return
    const handlePullUp = () => {
      if(bScroll.y <= bScroll.maxScrollY + 100) {
        pullUpDebounce()
      }
    }
    bScroll.on('scrollEnd', handlePullUp)
    return () => {
      bScroll.off('scrollEnd', handlePullUp)
    }
  }, [pullUp, bScroll, pullUpDebounce])

  useEffect(() => {
    if(!bScroll || !pullDown) return
    const handlePullDown = (pos) => {
      if(pos.y > 50) {
        pullDownDebounce()
      }
    }
    bScroll.on('touchEnd', handlePullDown)
    return () => {
      bScroll.off('touchEnd', handlePullDown)
    }
  }, [pullDown, bScroll, pullDownDebounce])

  useEffect(() => {
    if(refresh && bScroll) {
      bScroll.refresh()
    }
  })

  useImperativeHandle(ref, () => ({
    refresh() {
      if(bScroll) {
        bScroll.refresh()
        bScroll.scrollTo(0, 0)
      }
    },
    getBScroll() {
      if(bScroll) {
        return bScroll
      }
    },
    disable() {
      if(bScroll) {
        bScroll.disable()
      }
    },
    enable() {
      if(bScroll) {
        bScroll.enable()
      }
    }
  }))

  return (
    <ScrollContainer ref={scrollContainerRef}>
      {props.children}
      {enterLoading ? <Loading></Loading> : ''}
      {pullUpLoading ? <PullUpLoading><Loading></Loading></PullUpLoading> : ''}
      {pullDownLoading ? <PullDownLoading><LoadingV2></LoadingV2></PullDownLoading> : ''}
    </ScrollContainer>
  )
})

Scroll.defaultProps = {
  direction: "vertical",
  click: true,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true,
  enterLoading: false
}

Scroll.propTypes = {
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
  refresh: PropTypes.bool,
  onScroll: PropTypes.func,
  pullUp: PropTypes.func,
  pullDown: PropTypes.func,
  pullUpLoading: PropTypes.bool,
  pullDownLoading: PropTypes.bool,
  bounceTop: PropTypes.bool,
  bounceBottom: PropTypes.bool,
  enterLoading: PropTypes.bool
}

export default Scroll