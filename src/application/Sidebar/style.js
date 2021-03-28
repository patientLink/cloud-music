import styled from 'styled-px2vw'
import globalStyle from '../../assets/global-style'

export const SidebarCover = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 1500;
  /* background: rgba(0,0,0,.3); */
  display: none;
  /* background: ${globalStyle['background-cover-color']}; */
  .layer {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1110;
    background-color: ${globalStyle['background-cover-color']};
    transition: background-color 0.3s;
  }
  &.side-enter {
    .layer {
      background-color: rgba(0,0,0,0);
    }
    
    .slide {
      transform: translate3d(-100%, 0 , 0);
    }
  }
  &.side-enter-active {
    /* background: ${globalStyle['background-cover-color']};
    transition: background-color 0.3s; */
    .layer {
      background-color: ${globalStyle['background-cover-color']};
    }
    .slide {
      transform: translate3d(0, 0, 0);
      transition: all 0.3s;
    }
    
  }
  &.side-exit-active {
    /* background: rgba(0,0,0,0);
    transition: background-color 0.3s; */
    .layer {
      background-color: rgba(0,0,0,0);
    }
    .slide {
      transform: translate3d(-100%, 0, 0);
      transition: all 0.3s;
    }
  }
`

export const SidebarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 70vw;
  height: 100vh;
  display: none;
  z-index: 1120;
  background: ${globalStyle['background-color']};
  padding: 10px;
  flex-flow: column nowrap;
  align-items: center;
  font-size: ${globalStyle['font-size-m']};

  .logout {
    width: 100%;
    padding: 10px 0;
    text-align: center;
    background: ${globalStyle['highlight-background-color']};
    font-size: ${globalStyle['font-size-l']};
    line-height: ${globalStyle['font-size-xxl']};
    color: ${globalStyle['warning-color']};
  }
`

export const Block = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 5px 10px;
  margin-bottom: 10px;
  border: 1px solid ${globalStyle['border-color-grey']};
  border-radius: 5px;
  background: ${globalStyle['highlight-background-color']};
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  
  &.topBlock {
    background: ${props => (props.isLogin && props.bgUrl != '') ? `url(${props.bgUrl})` : globalStyle['theme-color']};
    background-size: cover;
    background-position: center;
    position: relative;
    border: none;
    flex-flow: column nowrap;
    align-items: flex-start;

    .btn_wrapper {
      height: 100%;
      width: 15%;
      position: absolute;
      right: 0;
      top: 0;
      
    }

    .btn {
      position: absolute;
      font-size: ${globalStyle['font-size-l']};
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  &.my-favourite {
    padding: 10px;
    position: relative;
    .favourite-icon {
      width: 36px;
      height: 36px;
      margin-right: 10px;
      background: rgba(197,163,163,.4);
      border-radius: 5px / 5px;
      text-align: center;
      line-height: 36px;
      font-size: ${globalStyle['font-size-xl']};
      color: ${globalStyle['warning-color']};
    }

    .favourite-text {
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-evenly;
      align-items: flex-start;
      
      span {
        font-size: ${globalStyle['font-size-m']};

        &:last-of-type {
          font-size: ${globalStyle['font-size-s']};
          color: ${globalStyle['font-color-desc-v2']};
        }
      }
    }

    .btn {
      position: absolute;
      font-size: ${globalStyle['font-size-l']};
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .avatarImg {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid transparent;
    margin-top: 30px;
    margin-bottom: 10px;
  }

  

  .detail {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: flex-start;
    color: #fff;
    .name {
      font-size: ${globalStyle['font-size-l']};
      margin-bottom: 5px;
      font-weight: 450;
    }
    .follow {
      margin-bottom: 5px;
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