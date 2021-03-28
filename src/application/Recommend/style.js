import styled from 'styled-px2vw'
import globalStyle from '../../assets/global-style'

export const Content = styled.div`
  position: fixed;
  top: 94px;
  bottom: ${props => props.play > 0 ? "60px" : 0};
  width: 100%;
`