import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-px2vw'
import globalStyle from '../../assets/global-style'
import {prefixStyle} from '../../api/utils'

const ProgressBarWrapper = styled.div`
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, .3);
    .progress {
      position: absolute;
      height: 100%;
      background: ${globalStyle["theme-color"]};
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -15px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid ${globalStyle["border-color"]};
        border-radius: 50%;
        background: ${globalStyle["theme-color"]};
      }
    }
  }
`

function ProgressBar(props) {

  const progressBar = useRef();
  const progress = useRef();
  const progressBtn = useRef();
  const [touch, setTouch] = useState({});

  const transform = prefixStyle('transform')

  const {percent} = props
  const {percentChange} = props

  useEffect(() => {
    if(percent >= 0 && percent <= 1 && !touch.initiated) {
      const barWidth = progressBar.current.clientWidth
      const offsetWidth = percent * barWidth
      progress.current.style.width = `${offsetWidth}px`
      progressBtn.current.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    }
  }, [percent])

  const _changePercent = () => {
    const barWidth = progressBar.current.clientWidth
    const curPercent = progress.current.clientWidth / barWidth
    percentChange(curPercent)
  }

  // const progressBtnHalfWidth = 8;  

  const _offset = (offsetWidth) => {
    progress.current.style.width = `${offsetWidth}px`;
    progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
  }
  
  const progressTouchStart = (e) => {
    const startTouch = {};
    startTouch.initiated = true //initial 为 true 表示滑动动作开始了
    startTouch.startX = e.touches[0].pageX // 滑动开始时横向坐标
    startTouch.left = progress.current.clientWidth // 当前 progress 长度
    setTouch(startTouch)
  }
  
  const progressTouchMove = (e) => {
    if (!touch.initiated) return;
    // 滑动距离   
    const deltaX = e.touches[0].pageX - touch.startX;
    const barWidth = progressBar.current.clientWidth; 
    const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth);
    _offset(offsetWidth)
  }
  
  const progressTouchEnd = (e) => {
    const endTouch = JSON.parse(JSON.stringify(touch));
    endTouch.initiated = false;
    setTouch(endTouch)
    _changePercent()
  }

  const progressClick = (e) => {
    const {left, width} = progressBar.current.getBoundingClientRect()
    const offsetWidth = Math.min(e.pageX - left , width)
    const offsetResult = Math.max(0, offsetWidth)
    _offset(offsetResult)
    _changePercent()
  }

  return (
    <ProgressBarWrapper>
      <div className="bar-inner" ref={progressBar} onClick={progressClick}>
        <div className="progress" ref={progress}></div>
        <div 
          className="progress-btn-wrapper" 
          ref={progressBtn}
          onTouchStart={progressTouchStart}
          onTouchMove={progressTouchMove}
          onTouchEnd={progressTouchEnd}
          >
          <div className="progress-btn"></div>
        </div>
      </div>
    </ProgressBarWrapper>
  )
}

export default React.memo(ProgressBar)