import React from 'react'
import styled from 'styled-px2vw'
import globalStyle from '../../assets/global-style'

const CircleWrapper = styled.div`
  position: relative;
  circle {
    /* stroke-width: 9px; */
    transform-origin: center;
    &.progress-background {
      transform: scale(0.9);
      stroke: ${globalStyle["theme-color-shadow"]};
    }
    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: ${globalStyle["theme-color"]};
    }
  }
`

function ProgressCircle (props) {
  const {radius, percent} = props;
  // 整个背景的周长
  const dashArray = Math.PI * 100;
  // 没有高亮的部分，剩下高亮的就是进度
  const dashOffset = (1 - percent) * dashArray;

  let vw = document.documentElement.clientWidth;
  let a = (radius / 375) * vw

  return (
    <CircleWrapper>
      <svg width={a} height={a} viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <circle className="progress-background" style={{strokeWidth: '9px'}} r="50" cx="50" cy="50" fill="transparent"/>
        <circle className="progress-bar" r="50" style={{strokeWidth: '9px'}} cx="50" cy="50" fill="transparent" 
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}/>
      </svg>
      {props.children}
    </CircleWrapper>
  )
}

export default React.memo(ProgressCircle);