import styled from 'styled-px2vw'
import globalStyle from '../../assets/global-style'

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: ${props => props.play > 0 ? "60px" : 0};
  z-index: 100;
  background: #fff;
  transform-origin: right bottom;
  transition: transform .4s;
  &.follow-swipe-enter {
    transform: rotateZ(60deg) translate3d(100%, 0, 0) scale3d(0, 0, 1);
  }
  &.follow-swipe-enter-active, 
  &.follow-swipe-enter-done {
    transform: rotateZ(0deg) translate3d(0, 0, 0) scale3d(1, 1, 1);
  }
  &.follow-swipe-exit, 
  &.follow-swipe-exit-active {
    transform: rotateZ(30deg) translate3d(100%, 0, 0) scale3d(0, 0, 1);
  }
`

export const ListWrapper = styled.div`
  position: absolute;
  top: 45px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;

  .item {
    width: 100%;
    height: 64px;
    box-sizing: border-box;
    padding: 0 16px;
    
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    .img-wrapper {
      width: 48px;
      height: 48px;
      margin-right: 8px;
      position: relative;

      img {
        border-radius: 50%;
      }
      .img-detail-icon {
        width: 35%;
        height: 35%;
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }

    .text {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-evenly;
      flex: 1;
      padding-left: 5px;
      border-bottom: 1px solid ${globalStyle['border-color-grey']};
      height: 100%;

      h5 {
        font-size: ${globalStyle['font-size-l']};
      }
      h6 {
        font-size: ${globalStyle['font-size-m']};
        color: ${globalStyle['font-color-desc-v2']};
      }
    }

    &:last-of-type {
      .text {
        border-bottom: none;
      }
    }
  }
`