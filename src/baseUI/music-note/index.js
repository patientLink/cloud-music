import React, {useEffect, useImperativeHandle, useRef, forwardRef} from 'react';
import styled from 'styled-px2vw';
import { prefixStyle } from './../../api/utils';
import globalStyle from '../../assets/global-style';

const Container = styled.div`
  .icon_wrapper {
    position: fixed;
    z-index: 1000;
    margin-top: -10px;
    margin-left: -10px;
    color: ${globalStyle["theme-color"]};
    font-size: 14px;
    display: none;
    transition: transform 1s cubic-bezier(.62,-0.1,.86,.57);
    transform: translate3d(0, 0, 0);
    >div {
      transition: transform 1s;
      font-size: 14px;
    }
  }
`

const MusicNote = forwardRef((props, ref) => {

  const iconsRef = useRef()
  // 容器中有 3 个音符，也就是同时只能有 3 个音符下落
  const ICON_NUMBER = 3

  const transform = prefixStyle("transform")

  // 原生 DOM 操作，返回一个 DOM 节点对象
  const createNode = (txt) => {
    const template = `<div class='icon_wrapper'>${txt}</div>`
    let tempNode = document.createElement('div')
    tempNode.innerHTML = template
    return tempNode.firstChild
  }

  const startAnimation = ({x, y}) => {
    let domArray = [].slice.call(iconsRef.current.children)
    for(let i = 0; i < ICON_NUMBER; i++) {
      
      let item = domArray [i]
      // 选择一个空闲的元素来开始动画
      if (item.running === false) {
        item.style.left = x + "px"
        item.style.top = y + "px"
        item.style.display = "inline-block"
  
        setTimeout (() => {
          item.running = true
          item.style[transform] = `translate3d(0, 750px, 0)`
          let icon = item.querySelector ("div")
          icon.style[transform] = `translate3d(-40px, 0, 0)`
        }, 20)
        break
      }
    }
  }

  useImperativeHandle(ref, () => ({
    startAnimation
  }))

  useEffect (() => {
    for (let i = 0; i < ICON_NUMBER; i++){
      let node = createNode(`<div class="iconfont">&#xe616;</div>`)
      iconsRef.current.appendChild(node)
    }
    
    let domArray = [].slice.call(iconsRef.current.children)
    domArray.forEach(item => {
      item.running = false
      item.addEventListener ('transitionend', function () {
        this.style['display'] = 'none'
        this.style[transform] = `translate3d(0, 0, 0)`
        this.running = false

        let icon = this.querySelector('div')
        icon.style[transform] = `translate3d(0, 0, 0)`
      }, false)
    })
    //eslint-disable-next-line
  }, [])

  return (
    <Container ref={iconsRef}>
    </Container>
  )
})

export default React.memo(MusicNote)