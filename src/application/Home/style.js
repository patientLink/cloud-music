import styled from 'styled-px2vw'
import style from '../../assets/global-style'

export const Top = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  background: ${style["theme-color"]};
  &>span {
    line-height: 50px;
    color: ${style["font-color-light"]};
    font-size: 20px;
    &.iconfont {
      font-size: 22px;
    }
  }
  .menu, .search {
    width: 42px;
    text-align: center;
  }
`

export const Tab = styled.div`
  height: 44px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background: ${style["theme-color"]};
  a {
    flex: 1;
    padding: 2px 0;
    font-size: 14px;
    color: ${style["border-color"]};
    &.selected {
      span {
        padding: 3px 0;
        font-weight: 700;
        position: relative;
        color: ${style["font-color-light"]};
        &:after {
          content: '';
          background: ${style["font-color-light"]};
          height: 2px;
          width: 100%;
          position: absolute;
          top: 100%;
          left: 0;
        }
        
      }
    }
  }
`

export const TabItem = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export const Layout = styled.div`
  height: 100%;
  &::after {
    content: '';
    display: block;
    clear: both;
  }
`
