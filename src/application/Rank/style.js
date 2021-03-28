import styled from 'styled-px2vw'
import globalStyle from '../../assets/global-style'

export const Container = styled.div`
  position: fixed;
  top: 94px;
  bottom: ${props => props.play > 0 ? "60px" : 0};
  width: 100%;
  .official,
  .global {
    margin: 0;
    padding: 10px 0 10px 8px;
    position: relative;
    font-size: ${globalStyle["font-size-l"]};
    color: ${globalStyle["font-color-desc"]};

    &::before {
      position: absolute;
      content: '';
      height: 16px;
      width: 2px;
      margin-top: -8px;
      top: 50%;
      left: 0;
      background: ${globalStyle["theme-color"]}
    }
  }
`

export const List = styled.ul`
  /* margin-top: 10px; */
  padding: 0 5px;
  display: ${props => props.globalRank ? "flex" : ""};
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  background: ${globalStyle["background-color"]};
  /* &::after {
    content: '';
    display: block;
    width: 32vw;
  } */
`

export const ListItem = styled.li`
  display: ${props => props.tracks.length ? "flex" : ""};
  padding: 3px 0;
  border-bottom: 1px solid ${globalStyle["border-color"]};
  .img_wrapper {
    width: ${props => props.tracks.length ? "27vw" : "32vw"};
    height: ${props => props.tracks.length ? "27vw" : "32vw"};
    border-radius: 3px;
    position: relative;
    .decorate {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 35px;
      border-radius: 3px;
      background: linear-gradient(hsla(0,0%,100%,0), hsla(0,0%,43%,.4));
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
    .update_frequency {
      position: absolute;
      left: 7px;
      bottom: 7px;
      font-size: ${globalStyle["font-size-ss"]};
      color: ${globalStyle["font-color-light"]};
    }
  }
`

export const SongList = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px 10px;
  >li {
    font-size: ${globalStyle["font-size-s"]};
    color: grey;
  }
`