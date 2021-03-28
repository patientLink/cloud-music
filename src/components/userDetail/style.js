import styled from'styled-px2vw';
import globalStyle from '../../assets/global-style';

export const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 15px;
  background-color: #fff;

  .content-list {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 20px;
    .item {
      margin-bottom: 8px;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      width: 100%;
      .icon {
        width: 40px;
        height: 40px;
        border-radius: 3px;
        margin-right: 7px;
        font-size: ${globalStyle['font-size-xxl']};
        line-height: 40px;
        text-align: center;
        &.rank {
          color: #fff;
          background: linear-gradient(to right top, black, red);
        }

        &.like {
          color: ${globalStyle['warning-color']};
          background: rgba(197,163,163,.4);
        }
      }
      .text {
        display: flex;
        height: 40px;
        flex-flow: column nowrap;
        justify-content: space-evenly;
        align-items: flex-start;
        max-width: 85%;
        ${globalStyle['noWrap']()}
        h5 {
          width: 100%;
          flex: 0 1 auto;
          line-height: ${globalStyle['font-size-l']};
          font-size: ${globalStyle['font-size-m']};
          ${globalStyle['noWrap']()}
        }
        h6 {
          font-size: ${globalStyle['font-size-ss']};
          color: ${globalStyle['font-color-desc']};
          font-weight: 350;
        }
      }
    }
  }
`

export const Block = styled.div`
  width: 100%;

  .title {
    font-size: ${globalStyle['font-size-l']};
    line-height: ${globalStyle['font-size-l']};
    margin-bottom: 12px;
    font-weight: 550;

    .sub-title {
      font-size: ${globalStyle['font-size-s']};
      color: ${globalStyle['font-color-desc']};
      font-weight: 350;
    }
  }

  
`

