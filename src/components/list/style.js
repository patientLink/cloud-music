import styled from 'styled-px2vw'
import globalStyle from '../../assets/global-style'

export const ListWrapper = styled.div`
  max-width: 100%;
  .title {
    position: relative;
    padding: 20px 0 20px 12px;
    font-size: ${globalStyle['font-size-ll']};
    line-height: 20px;
    &::before {
      height: 20px;
      width: 2px;
      margin-top: -10px;
      content: '';
      background: ${globalStyle['theme-color']};
      position: absolute;
      left: 0;
      top: 50%;
    }
  }
`

export const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`

export const ListItem = styled.div`
  position: relative;
  width: 32%;
  padding-bottom: 16px;

  .img_wrapper {
    .decorate {
      position: absolute;
      top: 0;
      width: 100%;
      height: 35px;
      border-radius: 3px;
      z-index:2;
      background: linear-gradient(hsla(0,0%,43%,.4), hsla(0,0%,100%,0));
    }
    position: relative;
    height: 0;
    padding-bottom: 100%;
    .play_count {
      position: absolute;
      right: 2px;
      top: 2px;
      font-size: ${globalStyle["font-size-s"]};
      line-height: 15px;
      z-index: 3;
      color: ${globalStyle["font-color-light"]};
      .play {
        vertical-align: top;
        font-size: ${globalStyle["font-size-ss"]};
      }
    }
    img {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
  }
  .desc {
      overflow: hidden;
      margin-top: 2px;
      padding: 0 6px;
      height: 30px;
      text-align: left;
      font-size: ${globalStyle["font-size-s"]};
      line-height: 1.2;
      color: ${globalStyle["font-color-desc"]};
      ${globalStyle['doubleOmitted']()}
    }
`