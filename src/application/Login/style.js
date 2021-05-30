import styled from 'styled-px2vw'
import globalStyle from '../../assets/global-style'

export const LoginContainer = styled.div`
  width: 100vw;
  height: ${props => props.pageHeight};
  padding: 8%;
  box-sizing: border-box;
  position: fixed;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  z-index: 1020;
  left: 0;
  top: 0;
  background: linear-gradient(#091119, #071727 70%, ${globalStyle['theme-color']});

  &::after {
    content: '';
    display: block;
    clear: both;
  }

  .iconfont {
    color: #fff;
    position: absolute;
    left: 8%;
    top: 5%;
    font-size: ${globalStyle['font-size-xl']};
    &.back {
      transform: rotate(180deg);
    }
  }

  header {
    width: 100%;
    margin-top: 40px;
    text-align: left;
    h1 {
      color: #fff;
      font-size: ${globalStyle['font-size-xxxl']};
    }
    h4 {
      color: #fff;
      font-size: ${globalStyle['font-size-m']};
      margin-top: 10px;
      line-height: 20px;
    }
    
  }

  .logo {
    width: 108px;
    height: 108px;
    margin-top: 100px;
    opacity: ${props => props.isfocus ? '0' : '100%'};
    transition: opacity 0.5s;
  }

  p {
    width: 100%;
    margin-top: 20px;
    color: #fff;
    font-size: ${globalStyle['font-size-m']};
    text-align: left;
  }
`

export const LoginBox = styled.div`

  margin-top: 40px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;

  transition: transform 0.5s;
  transform: ${props => props.isfocus ? 'translateY(-150px)' : 'translateY(0px)'};

  input {
    width: 280px;
    height: 50px;
    line-height: 50px;
    border: 1px solid ${globalStyle['border-color-grey']};
    border-radius: 25px;
    padding: 0 30px;
    margin-top: 16px;
    box-sizing: border-box;
    background: rgba(18, 38, 49, .4);
    outline: none;
    font-size: ${globalStyle['font-size-xl']};
    color: #fff;
    font-weight: 500;
    text-align: center;
    letter-spacing: 3px;
    caret-color: ${globalStyle['theme-color']};
    &::placeholder {
      font-weight: 450;
      letter-spacing: 0;
    }
  }

  .button {
    width: 280px;
    height: 50px;
    line-height: 50px;
    border: 1px solid ${globalStyle['border-color-grey']};
    border-radius: 25px;
    padding: 0 30px;
    margin-top: 16px;
    background: ${globalStyle['border-color-grey']};
    box-sizing: border-box;
    color: #fff;
    text-align: center;
    font-size: ${globalStyle['font-size-xl']};
    font-weight: 500;

    &.checked {
      background:${globalStyle['theme-color']}
    }
  }
`
export const CaptchaContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin-top: 80px;
  padding: 0 20px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;

  .captcha {
    width: 36px;
    height: 40px;
    line-height: 40px;
    border: 1px solid transparent;
    border-radius: 5px;
    background: rgba(38, 68, 89, .6);
    color: #fff;
    font-size: ${globalStyle['font-size-xl']};
    font-weight: 500;
    text-align: center;
  }
  input {
    position: absolute;
    outline: none;
    background: transparent;
    border: none;
    color: transparent;
    /* visibility: hidden; */
  }
`
  
