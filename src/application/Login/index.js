import React, {useEffect, useState, useRef} from 'react'
import {LoginContainer, LoginBox} from './style'
import {phoneLoginRequest, getLoginStatusRequest} from '../../api/request'
import Toast from '../../baseUI/toast'
import {connect} from 'react-redux'
import {changeUser, changeLoginStatus, changeUserId} from './store/actionCreators'

function Login(props) {
  // console.log(props)
  const {getAccountInfo, getLoginStatus} = props

  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [toastText, setToastText] = useState('')
  const toastRef = useRef()
  const [pageHeight, setPageHeight] = useState('100vh')
  const [isfocus, setIsFocus] = useState(false)

  useEffect(() => {
    let height = document.documentElement.clientHeight || document.body.clientHeight
    setPageHeight((height) + 'px')
  }, [])

  const failCallback = (msg) => {
    setToastText(msg)
    toastRef.current.show()
    setPassword('')
  }

  const succeedCallback = () => {
    setTimeout(() => {
      props.history.goBack()
    }, 1000);
  }

  const handleCheck = () => {
    if(phoneNumber.length !== 11) {
      setToastText('请输入正确的手机号码')
      toastRef.current.show()
      return
    }
    getAccountInfo(phoneNumber, password, failCallback, succeedCallback)
  }

  const handleFocus = () => {
    setIsFocus(true)
  }
  const handleBlur = () => {
    setIsFocus(false)
  }

  return (
    <LoginContainer pageHeight={pageHeight} isfocus={isfocus}>
      <React.Fragment>
        <i className="iconfont" onClick={() => props.history.goBack()}>&#xe61a;</i>
        <header>
          <h1>登录 网易云音乐</h1>
        </header>
        <img className="logo" src={require('./cloud.jpg')}></img>
        
        <LoginBox isfocus={isfocus}>
          <input 
            className="input_number" 
            placeholder="请输入手机号" 
            type="tel"
            maxLength="11"
            onChange={(e) => {
              setPhoneNumber(e.currentTarget.value)
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={phoneNumber}
            />
          <input
            className="input_psw"
            placeholder="请输入密码"
            type="password"
            onChange={(e) => {
              setPassword(e.currentTarget.value)
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={password}
          />
          <span 
            className={phoneNumber.length === 11 ? 'checked button' : 'button'}
            onClick={handleCheck}
            >
              {/* 获取验证码 */}
              登录
          </span>
        </LoginBox>          
      </React.Fragment>
      <Toast text={toastText} raise={true} ref={toastRef}/>
    </LoginContainer>
    
  )
}

const mapDispatchToProps = dispatch => ({
  getAccountInfo(num, psw, fn1, fn2) {
    phoneLoginRequest(num, psw)
    .then(res => {
      let {code, account} = res
      if(code && code === 502) {
        console.log(res.message)
        fn1(res.message)
        return
      } else if(code === 200) {
        if(account) {
          // let tempArr = cookie.split(';;')
          // tempArr.forEach(item => {
          //   document.cookie = item
          // })
          // console.log(document.cookie)
          dispatch(changeUserId(account.id))
          dispatch(changeLoginStatus(true))
          fn2()
        }
      }
    })
    .catch(err => {
      console.log(err.response?.data?.message)
      fn1(err.response?.data?.message)
    }) 
  }
})

export default connect(()=>({}), mapDispatchToProps)(React.memo(Login))