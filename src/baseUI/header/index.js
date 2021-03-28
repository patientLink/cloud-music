import React from 'react'
import styled, {keyframes} from 'styled-px2vw'
import globalStyle from '../../assets/global-style'
import PropTypes from 'prop-types'

const HeaderContainer = styled.div`
  position: fixed;
  padding: 5px 10px;
  padding-top: 0;
  height: 40px;
  width: 100%;
  z-index: 10001;
  display: flex;
  line-height: 40px;
  color: ${(props) => props.isDark ? globalStyle["font-color-dark"] : globalStyle["font-color-light"] };
  .back {
    margin-right: 5px;
    font-size: 20px;
    width: 20px;
  }
  >h1 {
    font-size: ${globalStyle["font-size-l"]};
    font-weight: 700;
  }
`

const marquee = keyframes`
  0% {
    left: 100%;
    /* transform: translateX(100%); */
  }
  100% {
    left: -100%;
    /* transform: translateX(-100%); */
  }
`

const Marquee = styled.div`
  width: 100%;
  height: 40px;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  .inner-text {
    /* left: 100%; */
    position: absolute;
    animation: ${marquee} 10s linear infinite;
    >h1 {
      font-size: ${globalStyle["font-size-l"]};
      font-weight: 700;
    }
  }
`

const Header = React.forwardRef((props, ref) => {
  const {handleClick, title, isMarquee, isDark} = props
  return (
    <HeaderContainer ref={ref} isDark={isDark}>
      <i className="iconfont back" onClick={handleClick}>&#xe61f;</i>
      {
        isMarquee ? <Marquee><div className="inner-text"><h1>{title}</h1></div></Marquee> : <h1>{title}</h1>
      }
    </HeaderContainer>
  )
})

Header.defaultProps = {
  handleClick: () => {},
  title: '标题',
  isMarquee: false,
  isDark: false,
}

Header.propTypes = {
  handleClick: PropTypes.func,
  title: PropTypes.string,
  isMarquee: PropTypes.bool,
  isDark: PropTypes.bool
}

export default React.memo(Header)
