import React, {forwardRef, useImperativeHandle, useState} from 'react';
import { CSSTransition } from 'react-transition-group';
import styled, {keyframes} from 'styled-px2vw';
import globalStyle from '../../assets/global-style';


const confirmFadeIn = keyframes`
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
`;
const confirmZoom = keyframes`
  0%{
    transform: scale(0);
  }
  50%{
    transform: scale(1.1);
  }
  100%{
    transform: scale(1);
  }
`

const ConfirmWrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  background: ${globalStyle["background-color-shadow"]};
  &.confirm-fade-enter-active{
    animation: ${confirmFadeIn} 0.3s;
    .confirm_content{
      animation: ${confirmZoom} 0.3s
    }
  }
  >div{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 100;
    .confirm_content{
      width: 270px;
      border-radius: 13px;
      background: ${globalStyle["highlight-background-color"]};
      .text{
        padding: 19px 15px;
        line-height: 22px;
        text-align: center;
        font-size: ${globalStyle["font-size-l"]};
        color: ${globalStyle["font-color-desc-v2"]};
      }
      .operate{
        display: flex;
        align-items: center;
        text-align: center;
        font-size: ${globalStyle["font-size-l"]};
        .operate_btn{
          flex: 1;
          line-height: 22px;
          padding: 10px 0;
          border-top: 1px solid ${globalStyle["border-color"]};
          color: ${globalStyle["font-color-desc"]};
          &.operate_btn-left{
            border-right: 1px solid ${globalStyle["border-color"]};
          }
          &.operate_btn-left::after {
            border-radius: 0 0 0 13px;
          }
          &.operate_btn-right::after {
            border-radius: 0 0 13px 0;
          }
        }
      }
    }
  }
`

const Confirm = forwardRef((props, ref) => {
  const [isShow, setIsShow] = useState(false);
  const { 
    text, 
    cancelBtnText, 
    confirmBtnText, 
    handleConfirmIndex,
    handleConfirm
  } = props;

  useImperativeHandle(ref, () => ({
    show() {
      setIsShow(true)
    }
  }))
  
  return (
    <CSSTransition classNames="confirm-fade" timeout={300} appear={true} in={isShow}>
      <ConfirmWrapper style={{display: isShow ? "block": "none"}} onClick={e => e.stopPropagation()}>
        <div>
          <div className="confirm_content">
            <p className="text">{text}</p>
            <div className="operate" >
              <div 
                className="operate_btn operate_btn-left btn-to-deep" 
                onClick={() => { 
                  setIsShow(false)
                }}>{cancelBtnText}</div>
              <div 
                className="operate_btn operate_btn-right btn-to-deep" 
                onClick={() => { 
                  setIsShow(false)
                  handleConfirm(handleConfirmIndex)
                }}>{confirmBtnText}</div>
            </div>
          </div>
        </div>
      </ConfirmWrapper>
    </CSSTransition>
  )
})

export default React.memo(Confirm);