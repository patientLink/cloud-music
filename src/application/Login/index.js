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
  // const [captcha, setCaptcha] = useState('')
  // const [isSent, setIsSent] = useState(true)

  const [toastText, setToastText] = useState('')
  const toastRef = useRef()
  // const captchaRef = useRef()

  // const timer = useRef(null)
  // const [count, setCount] = useState(-2)


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


  // const handleCounting = () => {
  //   let innerCount = 60
  //   timer.current = setInterval(() => {
      
  //     setCount(innerCount--)
  //     console.log(count)
  //     console.log(innerCount)
  //     if(innerCount < -1) {
  //       console.log('<0')
  //       clearInterval(timer.current)
  //       timer.current = null
  //     }
  //   }, 1000);
  // }

  return (
    <LoginContainer>
      {
        // isSent ? 
        // <React.Fragment>
        //   <i className="iconfont back" onClick={() => setIsSent(false)}>&#xe604;</i>
        //   <header>
        //     <h1>输入短信验证码</h1>
        //     <h4>验证码已发送至 {phoneNumber}, 请在下方输入4位验证码</h4>
        //   </header>
        //   <CaptchaContainer>
        //     <input
        //       type="tel"
        //       maxLength="4"
        //       ref={captchaRef}
        //       onChange={(e) => {
        //         setCaptcha(e.currentTarget.value)
        //       }}
        //       value={captcha}
        //     />
        //     {
        //       [0,0,0,0].map((item, index) => {
        //         return (
        //           <div 
        //             className="captcha" 
        //             key={index}
        //             onClick={() => {
        //               captchaRef.current.focus()
        //             }}
        //           >{captcha[index] || ''}</div>
        //         )
        //       })
        //     }
        //   </CaptchaContainer>
        //   {
        //     count < 0 ? 
        //     <p onClick={handleCheck}>重发验证码</p> :
        //     <p>{count}s后 可重新发送验证码</p>
        //   }
        // </React.Fragment>
        // :
        <React.Fragment>
          <i className="iconfont" onClick={() => props.history.goBack()}>&#xe61a;</i>
          <header>
            <h1>登录 网易云音乐</h1>
          </header>
          <img className="logo" src={require('./cloud.jpg')}></img>
          
          <LoginBox>
            <input 
              className="input_number" 
              placeholder="请输入手机号" 
              type="tel"
              maxLength="11"
              onChange={(e) => {
                setPhoneNumber(e.currentTarget.value)
              }}
              value={phoneNumber}
              />
            <input
              className="input_psw"
              placeholder="请输入密码"
              type="password"
              onChange={(e) => {
                setPassword(e.currentTarget.value)
              }}
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
      }
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