import styled from'styled-px2vw';
import globalStyle from '../../assets/global-style';

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: ${props => props.play > 0 ? "60px": 0};
  width: 100%;
  z-index: 100;
  overflow: hidden;
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
export const ImgWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 75%;
  transform-origin: top;
  background: url(${props => props.bgUrl});
  background-size: cover;
  z-index: 50;
  .filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.3);
  }
`
export const CollectButton = styled.div`
  position: absolute;
  left: 0; 
  right: 0;
  margin: auto;
  box-sizing: border-box;
  width: 120px;
  height: 40px;
  margin-top: -55px;
  z-index: 50;
  background: ${globalStyle["theme-color"]};
  color: ${globalStyle["font-color-light"]};
  border-radius: 20px;
  text-align: center;
  font-size: 0;
  line-height: 40px;
  .iconfont {
    display: inline-block;
    margin-right: 10px;
    font-size: ${globalStyle['font-size-m']};
  }
  .text {
    display: inline-block;
    font-size: 14px;
    letter-spacing: 5px;
  }
`

export const SongListWrapper = styled.div`
  position: absolute;
  z-index: 50;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  >div {
    position: absolute;
    left: 0;
    width: 100%;
    overflow: visible;
  }
`

export const BgLayer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: white;
  border-radius: 10px;
  z-index: 50;
`