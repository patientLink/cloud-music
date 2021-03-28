import React, {useState, useImperativeHandle, forwardRef} from 'react'
import styled from 'styled-px2vw'
import { CSSTransition } from 'react-transition-group'
import globalStyle from '../../assets/global-style'

const ToastWrapper = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  width: 100%;
  height: 50px;
  bottom: 0;
  &.drop-enter{
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  &.drop-enter-active{
    opacity: 1;
    transition: all 0.3s ease-in;
    transform: translate3d(0, 0, 0);
  }
  &.drop-enter-done{
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  &.drop-exit-active{
    opacity: 0;
    transition: all 0.3s ease-in;
    transform: translate3d(0, 100%, 0);
  }

  &.raise-enter{
    top: 50%;
    transform: translate3d(0, -50%, 0);
    opacity: 0;
  }
  &.raise-enter-active{
    top: 50%;
    transform: translate3d(0, -50%, 0);
    opacity: 1;
    transition: opacity 0.3s ease-in;
  }
  &.raise-enter-done{
    top: 50%;
    transform: translate3d(0, -50%, 0);
    opacity: 1;
  }
  &.raise-exit-active{
    top: 50%;
    transform: translate3d(0, -50%, 0);
    opacity: 0;
    transition: opacity 0.3s ease-in;
  }

  .text{
    line-height: 50px;
    padding: 0 10px;
    
    text-align: center;
    color: #fff;
    font-size: ${globalStyle["font-size-l"]};
  }

  @media screen and (min-aspect-ratio: 376 / 667) and (max-aspect-ratio: 768 / 1024) {
    height: 35px;
    .text {
      line-height: 35px;
      font-size: ${globalStyle['font-size-m']};
    }
  }
`

const Toast = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const [timer, setTimer] = useState('');
  const {text, raise} = props;
  
  const raiseStyle = () => ({
    border: '1px solid transparent',
    borderRadius: '3px',
    background: 'rgba(38, 68, 89, .8)'
  })

  useImperativeHandle(ref, () => ({
    show() {
      // 防抖
      if(timer) clearTimeout(timer);
      setShow(true);
      setTimer(setTimeout(() => {
        setShow(false)
      }, 3000));
    }
  }))
  return (
    <CSSTransition in={show} timeout={300} classNames={raise ? "raise" : "drop"} unmountOnExit>
      <ToastWrapper>
        <span className="text" style={raise ? raiseStyle() : {}}>{text}</span>
      </ToastWrapper>
    </CSSTransition>
  )
});

export default React.memo(Toast);