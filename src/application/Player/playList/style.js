import styled from'styled-px2vw'
import globalStyle from '../../../assets/global-style'

export const PlayListWrapper = styled.div `
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  background-color: ${globalStyle["background-color-shadow"]};
  &.list-fade-enter {
    opacity: 0;
  }
  &.list-fade-enter-active {
    opacity: 1;
    transition: all 0.3s;
  }
  &.list-fade-exit {
    opacity: 1;
  }
  &.list-fade-exit-active {
    opacity: 0;
    transition: all 0.3s;
  }

  .list_wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    opacity: 1;
    border-radius: 25px 25px 0 0;
    background-color: ${globalStyle["highlight-background-color"]};
    transform: translate3d(0, 0, 0);
    .list_close {
      text-align: center;
      line-height: 50px;
      background: ${globalStyle["background-color"]};
      font-size: ${globalStyle["font-size-l"]};
      color: ${globalStyle["font-color-desc"]};
    }
  }
`
export const ScrollWrapper = styled.div`
  height: 400px;
  overflow: hidden;
  @media screen and (min-aspect-ratio: 376 / 667) and (max-aspect-ratio: 768 / 1024) {
    height: 200px;
  }

  .personal-fm-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    .personal-fm-title {
      font-size: ${globalStyle["font-size-ll"]};
      text-align: center;
    }
    .personal-fm-detail {
      color: ${globalStyle["warning-color"]};
      font-size: ${globalStyle["font-size-l"]};
      text-align: center;
      .personal-fm-song-artist {
        font-size: ${globalStyle["font-size-m"]};
      }
    }
  }
`

export const ListHeader = styled.div `
  position: relative;
  padding: 20px 30px 10px 20px;
  .title {
    display: flex;
    align-items: center;
    >div {
      flex:1;
      .text {
        flex: 1;
        font-size: ${globalStyle["font-size-m"]};
        color: ${globalStyle["font-color-desc"]};
      }
    }
    .iconfont {
      margin-right: 10px;
      font-size: ${globalStyle["font-size-ll"]};
      color: ${globalStyle["theme-color"]};
    }
    .clear {
      ${globalStyle.extendClick()}
      font-size: ${globalStyle["font-size-l"]};
      &::after {
        width: 200%;
        height: 200%;
        transform: translate(-25%, -25%);
      }
    }
  }
`

export const ListContent = styled.div `
  .item {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 30px 0 20px;
    overflow: hidden;
    .current {
      flex: 0 0 20px;
      width: 20px;
      font-size: ${globalStyle["font-size-m"]};
      color: ${globalStyle["theme-color"]};
    }
    .text {
      flex: 1;
      ${globalStyle.noWrap()}
      font-size: ${globalStyle["font-size-m"]};
      line-height: 18px;
      color: ${globalStyle["font-color-desc-v2"]};
      .icon-favorite {
        color: ${globalStyle["theme-color"]};
      }
    }
    .like {
      ${globalStyle.extendClick()}
      margin-right: 15px;
      .iconfont {
        font-size: ${globalStyle["font-size-l"]};
        color: ${globalStyle["theme-color"]};
          &.i-favorite {
          color: ${globalStyle['theme-color']}
        }
      }

      
    }
    .delete {
      ${globalStyle.extendClick()}
      .iconfont {
        font-size: ${globalStyle["font-size-m"]};
        color: ${globalStyle["theme-color"]};
      }
      &::after {
        width: 200%;
        height: 200%;
        transform: translate(-25%, -25%);
      }
    }
  }
`