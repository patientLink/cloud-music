import styled from 'styled-px2vw'
import globalStyle from '../../assets/global-style'

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: ${props => props.play > 0 ? "60px" : 0};
  z-index: 100;
  background: ${globalStyle["background-color"]};
  transform-origin: right bottom;
  transition: transform .4s;
  &.fly-enter, &.fly-appear {
    transform: rotateZ(60deg) translate3d(100%, 0, 0) scale3d(0, 0, 1);
  }
  &.fly-enter-active, 
  &.fly-appear-active, 
  &.fly-appear-done, 
  &.fly-enter-done {
    transform: rotateZ(0deg) translate3d(0, 0, 0) scale3d(1, 1, 1);
  }
  &.fly-exit, 
  &.fly-exit-active {
    transform: rotateZ(30deg) translate3d(100%, 0, 0) scale3d(0, 0, 1);
  }
`

export const TopDesc = styled.div`
  background-size: 100%;
  padding: 5px 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 225px;
  position: relative;
  .background {
    z-index: -1;
    background: rgba(0,0,0,.5);
    background-position: 0 0;
    background-size: 100% 100%;
    position: absolute;
    width: 100%;
    height: 100%;
    filter: blur(20px);
    .filter {
      position: absolute;
      z-index: 10;
      top: 0; 
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.2);
    }
  }
  .img_wrapper {
    width: 120px;
    height: 120px;
    position: relative;
    background: radial-gradient(circle, white 40%, grey);
    border-radius: 20%;
    img {
      width: 120px;
      height: 120px;
      border-radius:3px;
    }
  }
  .desc_wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 120px;
    padding: 0 10px;
    .title {
      color: ${globalStyle["font-color-light"]};
      font-weight: 700;
      line-height: 20px;
      font-size: ${globalStyle["font-size-l"]};
      span {
        font-size: ${globalStyle["font-size-s"]};
        color: ${globalStyle["font-color-desc-v2"]};
      }
    }
  }
`