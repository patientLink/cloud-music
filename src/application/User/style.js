import styled from'styled-px2vw';
import globalStyle from '../../assets/global-style';

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: ${props => props.play > 0 ? "60px": 0};
  width: 100%;
  z-index: 120;
  overflow: hidden;
  background: ${globalStyle["background-color"]};
  /* transform-origin: right bottom; */
  transition: transform .3s;
  &.fly-enter, &.fly-appear {
    transform: translate3d(0, 100%, 0);
  }
  &.fly-enter-active, 
  &.fly-appear-active, 
  &.fly-appear-done, 
  &.fly-enter-done {
    transform: translate3d(0, 0, 0);
  }
  &.fly-exit, 
  &.fly-exit-active {
    transform: translate3d(0, 100%, 0);
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
    background: rgba(7, 17, 27, 0.4);
    filter: 
  }
`
export const InfoContent = styled.div`
  position: absolute;
  left: 0; 
  right: 0;
  /* margin: auto; */
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  box-sizing: border-box;
  width: 100%;
  height: 100px;
  padding: 0 18px;
  margin-top: -235px;
  z-index: 50;

  .avatarImg {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 1px solid transparent;
    margin-top: 30px;
    margin-bottom: 20px;
  }

  .detail {
    display: flex;
    position: relative;
    flex-flow: column nowrap;
    width: 100%;
    justify-content: space-between;
    align-items: flex-start;
    color: #fff;
    .name {
      font-size: ${globalStyle['font-size-l']};
      margin-bottom: 8px;
      font-weight: 450;
    }
    .follow {
      margin-bottom: 8px;
      span {
        font-weight: 300;
        font-size: ${globalStyle['font-size-s']};
        border-left: 1px solid rgba(256,256,256,.7);
        padding-left: 13px ;
        padding-right: 10px;
        letter-spacing: 1px;

        &:first-of-type {
          border-left: none;
          padding-left: 0;
        }
      }
    }
    .class {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 5px;
    }
    .follow_btn {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      right: 0;
      bottom: 5px;
      width: 76px;
      height: 28px;
      border: none;
      border-radius: 14px;
      color: #fff;
      background-color: ${globalStyle['warning-color']};
      font-size: 12px;
      line-height: 28px;
      text-align: center;
      .iconfont {
        font-size: 8px;
        line-height: 28px;
        color: #fff;
        margin-right: 4px;
        transform: rotate(45deg);
      }
    }
    .followed {
      position: absolute;
      display: flex;
      justify-content: center;
      padding: 0;
      right: 12px;
      bottom: 5px;
      /* width: 26px; */
      height: 26px;
      border: none;
      background-color: transparent;
      color: #fff;
      
      font-size: 14px;
      line-height: 26px;
      .iconfont {
        align-items: center;
        width: 26px;
        height: 26px;
        line-height: 26px;
        font-size: 18px;
        margin-right: 5px;
        border: none;
        border-radius: 50%;
        color: #fff;
        background-color: rgba(265,265,265, .4);
      }
    }
    .tag {
      padding: 2px 8px;
      font-size: ${globalStyle['font-size-s']};
      font-style: italic;
      background: rgba(265,265,265, .5);
      border: 1px solid transparent;
      border-radius: 9px / 50%;
      margin-right: 4px;

      &.gender {
        font-style: normal;
        color: #fff;
        background: ${props => props.gender === 1 ? 'rgba(143,190,202,.6)' : 'rgba(241,131,188,.6)'};
      
        .icon {
          font-size: ${globalStyle['font-size-s']};
          color: ${props => props.gender === 1 ? '#10d2ff' : '#f5009e'};
        }
      }
    }
  }
`

export const AlbumListWrapper = styled.div`
  position: absolute;
  z-index: 50;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  >div {
    position: absolute;
    left: 0;
    top: 25px;
    width: 100%;
    overflow: visible;
  }
`

export const BgLayer = styled.div`
  position: absolute;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-around;
  top: 0;
  height: 30px;
  width: 100%;
  background: white;
  border-radius: 10px 10px 0 0 / 10px 10px 0 0;
  border-bottom: 1px solid ${globalStyle['border-color-grey']};
  z-index: 110;

  .tag {
    height: 30px;
    box-sizing: border-box;
    flex: 0 1 auto;
    line-height: 30px;
    font-size: ${globalStyle['font-size-m']};

    &.active {
      font-weight: 550;
      color: ${globalStyle['warning-color']};
      border-bottom: 2px solid ${globalStyle['warning-color']};
    }
  }
`