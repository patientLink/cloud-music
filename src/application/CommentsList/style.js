import styled from 'styled-px2vw'
import globalStyle from '../../assets/global-style'

export const CommentsListWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1010;
  background-color: ${globalStyle['background-color']};
  transition: all 0.3s;
  &.list-swipe-enter {
    opacity: 0;
    transform: translate3d(0, 5%, 0);
  }
  &.list-swipe-enter-active {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  &.list-swipe-exit {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  &.list-swipe-exit-active {
    opacity: 0;
    transform: translate3d(0, 5%, 0);
  }
`

export const IntroBlock = styled.div`
  position: fixed;
  left: 0;
  right: 0; 
  top: 45px;
  height: 80px;
  padding: 4px 16px;
  box-sizing: border-box;
  background-color: ${globalStyle['background-color']};
  border-bottom: 5px solid ${globalStyle['border-color-grey']};
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  img {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    margin-right: 10px;
  }

  .comments-title {
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    height: 100%;
    justify-content: space-evenly;
    
    h5 {
      font-size: ${globalStyle['font-size-l']};
      line-height: 20px;
      /* height: ${globalStyle['font-size-ll']}; */
      max-height: 40px;
      /* box-sizing: border-box; */
      
      max-width: 75%;
      ${globalStyle['doubleOmitted']()}
    }
    h6 {
      font-size: ${globalStyle['font-size-m']};
      color: ${globalStyle['theme-color']};
      line-height: ${globalStyle['font-size-m']};
      height: ${globalStyle['font-size-m']};
      /* margin-top: 4px; */
      max-width: 75%;
    }
  }

`

export const TypeBar = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 125px;
  height: 25px;
  display: flex;
  padding-left: 66%;
  flex-flow: row nowrap;
  background-color: ${globalStyle['background-color']};
  /* text-align: right; */
  /* vertical-align: middle; */
  div {
    box-sizing: border-box;
    height: 25px;
    padding: 6px 0;
    display: flex;
    span {
      padding: 0 8px;
      font-size: ${globalStyle['font-size-s']};
      color: ${globalStyle['font-color-desc-v3']};
      border-left: 1px solid ${globalStyle['font-color-desc-v3']};

      &.selected {
        color: ${globalStyle['font-color-dark']};
        font-weight: bold;
      }
    }
    &:first-of-type {
      span {
        border-left: none;
      }
    }

  }

`

export const ContentArea = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 150px;
  bottom: 0;
  overflow: hidden;
  background-color: ${globalStyle['background-color']};
  padding: 5px 16px 0;
`

export const CommentCard = styled.div`
  display: flex;
  flex-flow: row nowrap;
  padding: 10px 0 0;
  position: relative;
  .left {
    width: 38px;
    padding-right: 11px;

    .img_wrapper {
      width: 38px;
      height: 38px;
    }
    img {
      /* width: 38px;
      height: 38px; */
      box-sizing: border-box;
      border-radius: 50%;
      border: 1px solid transparent;
    }
  }

  .right {
    
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    justify-content: flex-start;
    border-bottom: 1px solid ${globalStyle['border-color-grey']};
    flex: 1;
    .nickname {
      padding: 3px 0;
      color: ${globalStyle['font-color-desc']};
      font-size: ${globalStyle['font-size-m']};
    }
    time {
      padding: 0;
      color: ${globalStyle['font-color-desc-v2']};
      font-size: ${globalStyle['font-size-ss']};
    }
    .content {
      padding: 12px 0;
      font-size: ${globalStyle['font-size-m']};
      line-height: ${globalStyle['font-size-xxl']};
      white-space: pre-wrap;
    }
  }

  .liked {
    position: absolute;
    top: 10px;
    right: 0;
    font-weight: normal;
    .liked-count {
      font-size: ${globalStyle['font-size-s']};
    }
    .iconfont {
      font-size: ${globalStyle['font-size-s']};
      &.like {
        color: ${globalStyle['warning-color']};
      }
    }
    
  }
`