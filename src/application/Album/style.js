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
  padding-bottom: 50px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 275px;
  position: relative;
  .background {
    z-index: -1;
    background: url(${props => props.background}) no-repeat;
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
    .decorate {
      position: absolute;
      top: 0;
      width: 100%;
      height: 35px;
      border-radius: 3px;
      background: linear-gradient(hsla(0,0%,43%,.4), hsla(0,0%,100%,0));
    }
    .play_count {
      position: absolute;
      right: 2px;
      top: 2px;
      font-size: ${globalStyle["font-size-s"]};
      line-height: 15px;
      color: ${globalStyle["font-color-light"]};
      .play {
        vertical-align: top;
        font-size: ${globalStyle["font-size-s"]};
      }
    }
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
      /* max-height: 40px; */
      color: ${globalStyle["font-color-light"]};
      font-weight: 700;
      line-height: 20px;
      font-size: ${globalStyle["font-size-l"]};
      /* ${globalStyle['doubleOmitted']()} */
    }
    .person {
      display: flex;
      .avatar {
        width: 20px;
        height: 20px;
        margin-right: 5px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .name {
        line-height: 20px;
        font-size: ${globalStyle["font-size-m"]};
        color: ${globalStyle["font-color-desc-v2"]};
      }
    }
  }
`

export const Menu = styled.div`
  position: relative;
  display: flex;
  justify-content: space-evenly;
  box-sizing: border-box;
  padding: 10px 0 10px 0;
  margin: -100px 70px 0 70px;
  /* border: 1px solid ${globalStyle["font-color-light"]}; */
  /* border-bottom: none; */
  /* border-radius: 20px; */
  >div {
    display: flex;
    flex-direction: column;
    line-height: 20px;
    text-align: center;
    font-size: ${globalStyle["font-size-s"]};
    color: ${globalStyle["font-color-light"]};
    z-index:1000;
    font-weight: 500;
    width: 40px;
    .iconfont {
      font-size: 20px;
    }
  }
  .btn-unable {
    color: ${globalStyle['font-color-desc-v2']};
  }
`;