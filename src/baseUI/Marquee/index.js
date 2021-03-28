import React, {useEffect, useRef, useState} from 'react'
import styled, {keyframes} from 'styled-px2vw'
import globalStyle from '../../assets/global-style'

const sizeList = {
  s: globalStyle['font-size-s'],
  m: globalStyle['font-size-m'],
  l: globalStyle['font-size-l'],
  ll: globalStyle['font-size-ll']
}

const flowing = keyframes`
  0% {
    left: 100%;
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-100%, 0, 0);
    left: 0;
  }
`



const MarqueeContainer = styled.div`
  width: ${props => props.width};
  margin: 0 auto;
  line-height: ${props => props.lineHeight};
  height: ${props => props.lineHeight};
  text-align: center;
  font-size: ${props => sizeList[props.fontSize]};
  overflow: hidden;
  position: relative;
  color: ${props => props.color === 'main' ? globalStyle['font-color-desc'] : globalStyle['font-color-desc-v2']};
  h1 {
    position: absolute;
    top: 0;
    white-space: nowrap;
  }
  h1.normal {
    left: 50%;
    transform: translate3d(-50%, 0 ,0);
  }
  h1.marquee {
    left: 100%;
    animation-name: ${flowing};
    animation-duration: ${props => props.ratio}s;
    animation-timing-function: linear;
    animation-delay: 0s;
    animation-iteration-count: infinite;
    animation-direction: normal;
  }
`

function Marquee(props) {
  const {width, lineHeight, fontSize, color, txt} = props
  const headerRef = useRef()
  const containerRef = useRef()
  const lengthRatio = useRef(0)
  const [flow, setFlow] = useState(false)

  useEffect(() => {
    setFlow(false)
  }, [txt])

  useEffect(() => {
    // console.log('computed')
    const currentWidth = parseFloat(getComputedStyle(headerRef.current)['width'])
    const containerWidth = parseFloat(getComputedStyle(containerRef.current)['width'])
    // console.log(currentWidth, containerWidth)
    if(containerWidth < currentWidth) {
      setFlow(true)
      lengthRatio.current = ((currentWidth / containerWidth) * 6) | 0
    }
  }, [txt , headerRef.current, containerRef.current])

  return (
    <MarqueeContainer {...props} ref={containerRef} ratio={lengthRatio.current}>
      <h1 className={flow ? 'marquee' : 'normal'} ref={headerRef}>
        {txt}
      </h1>
    </MarqueeContainer>
    
  )
}

export default React.memo(Marquee)