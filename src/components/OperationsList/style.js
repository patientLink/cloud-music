import styled from'styled-px2vw'
import globalStyle from '../../assets/global-style'

export const PlayListWrapper = styled.div`
  position: fixed;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1110;
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
    /* transform: translate3d(0, 0, 0); */
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
  &.scroll-wrapper_song {
    height: 300px;
  }
  @media screen and (min-aspect-ratio: 376 / 667) and (max-aspect-ratio: 768 / 1024) {
    height: 200px;
  }
`

export const ListHeader = styled.div`
  position: relative;
  padding: 20px 20px 10px 20px;
  border-bottom: 1px solid ${globalStyle['border-color']};
  .title {
    display: flex;
    align-items: center;
    flex: 1 0 auto;
    .song-cover {
      width: 46px;
      height: 46px;
      border-radius: 3px;
      margin-right: 10px;
    }
    .song-detail {
      max-width: 80%;
      height: 46px;
      display: flex;
      flex-flow: column nowrap;
      align-items: flex-start;
      justify-content: space-evenly;
      font-size: ${globalStyle['font-size-m']};

      span {
        max-width: 100%;
        ${globalStyle.noWrap()}
      }
      .song-detail_artist {
        color: ${globalStyle['font-color-desc-v2']};
      }
    }
    .album-title {
      font-size: ${globalStyle['font-size-l']};
      font-weight: bold;
      height: 30px;
      line-height: 30px;
    }
    .album-title {
      font-size: ${globalStyle['font-size-l']};
      font-weight: bold;
      height: 30px;
      line-height: 30px;
    }
  }
  
`

export const ListContent = styled.div`
  padding: 6px 0;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: flex-start;
  &.list-content_album {
    padding: 6px 0;
  }
`

export const ListItem = styled.div`
  width: 100%;
  height: 40px;
  padding: 4px 30px;
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  &.list-item_album, &.list-item_singer {
    height: 54px;
    padding: 6px 20px;
  }

  .iconfont_icon {
    font-size: ${globalStyle['font-size-ll']};
    margin-right: 14px;
  }
  .option-text {
    font-size: ${globalStyle['font-size-m']};
    ${globalStyle['noWrap']};
  }
  &.btn-unable {
    color: ${globalStyle['font-color-desc-v2']};
  }
  .favourite-icon {
    width: 42px;
    height: 42px;
    margin-right: 10px;
    background: rgba(197,163,163,.4);
    border-radius: 8px;
    text-align: center;
    line-height: 42px;
    font-size: ${globalStyle['font-size-xxxl']};
    color: ${globalStyle['warning-color']};
  }
  .album-cover, .singer-cover{
    width: 42px;
    height: 42px;
    border-radius: 8px;
    margin-right: 10px;
  }
  .album-detail {
    max-width: 80%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-evenly;
    align-items: flex-start;
    height: 42px;
    .album-name {
      max-width: 100%;
      font-size: ${globalStyle['font-size-m']};
      ${globalStyle['noWrap']};
    }
    .album-count {
      max-width: 100%;
      font-size: ${globalStyle['font-size-s']};
      color: ${globalStyle['font-color-desc']};
      ${globalStyle['noWrap']};
    }
  }
  .singer-name {
    max-width: 100%;
    font-size: ${globalStyle['font-size-m']};
    ${globalStyle['noWrap']};
  }
`