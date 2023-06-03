import { useState } from 'react'
import LoginImg from './login.jpg'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { sendEmailCode } from './utils'

const Login = () => {
  const [isNewUser, _setIsNewUser] = useState(false)
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailCode, setEmailCode] = useState('')

  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const setIsNewUser = (isNewUser: boolean) => {
    if (isNewUser) {
      if (usernameOrEmail.includes('@')) {
        setEmail(usernameOrEmail)
      } else {
        setUsername(usernameOrEmail)
      }
    } else {
      setUsernameOrEmail(email)
    }
    _setIsNewUser(isNewUser)
  }

  const setError = (message: string) => {
    enqueueSnackbar(message, {
      variant: 'error'
    })
  }

  const setSuccess = (message: string) => {
    enqueueSnackbar(message, {
      variant: 'success'
    })
  }

  const verify = () => {
    if (!usernameOrEmail) {
      setError('用户名不能为空')

      return false
    }
    if (!password) {
      setError('密码不能为空')

      return false
    }
    return true
  }

  const login = async () => {
    if (!verify()) return
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usernameOrEmail, password })
    })
    const res = await response.json()

    if (res.success) {
      localStorage.setItem('token', res.data.access_token)
      setSuccess('登录成功')
      navigate('/', { replace: true })
    } else {
      setError(res.message)
    }
  }

  const register = async ({
    email,
    username,
    password,
    emailCode
  }: {
    email: string
    username: string
    password: string
    emailCode: string
  }) => {
    if (!verify()) return
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, username, password, emailCode })
    })
    const res = await response.json()
    if (res.success) {
      localStorage.setItem('token', res.data.access_token)
      setSuccess('注册成功')
      navigate('/', { replace: true })
    } else {
      setError(res.message)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isNewUser) {
      register({
        email,
        username,
        password,
        emailCode
      })
    } else {
      login()
    }
  }

  return (
    <div
      className='hero min-h-screen bg-base-200'
      style={{
        backgroundImage: `url(${LoginImg})`
      }}
    >
      <div className='hero-overlay bg-opacity-60'></div>
      <div className='hero-content flex-col lg:flex-row-reverse max-w-3xl text-neutral-content'>
        <div className='text-center lg:text-left'>
          <h1 className='text-5xl font-bold'>现在就登录</h1>
          <p className='py-6 max-w-lg hidden lg:block'>
            欢迎来到我们的AI平台。在这里，您可以与先进的人工智能进行互动，获取知识、寻求建议或享受有趣的对话。我们的平台旨在为您提供无缝的AI体验，让智能科技成为您日常生活的一部分。开始您的探索之旅，发现智能的无限可能。
          </p>
          <p className='py-2 block lg:hidden'>
            连接未来，探索智能。
            <br />
            您的AI体验，从这里启程。
          </p>
        </div>
        <div className='card flex-shrink-0 w-full max-w-md min-w-[340px] shadow-2xl bg-base-100'>
          <div className='card-body text-base-content'>
            <form onSubmit={handleSubmit}>
              {isNewUser ? (
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>电子邮件</span>
                  </label>
                  <input
                    type='email'
                    placeholder='电子邮件'
                    className='input input-bordered'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>电子邮件/用户名</span>
                  </label>
                  <input
                    type='text'
                    placeholder='电子邮件/用户名'
                    className='input input-bordered'
                    value={usernameOrEmail}
                    onChange={e => setUsernameOrEmail(e.target.value)}
                    required
                  />
                </div>
              )}
              {isNewUser && (
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>用户名</span>
                  </label>
                  <input
                    type='username'
                    placeholder='用户名'
                    className='input input-bordered'
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>密码</span>
                </label>
                <input
                  type='password'
                  placeholder='密码'
                  className='input input-bordered'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                {!isNewUser && (
                  <label className='label'>
                    <a href='#' className='label-text-alt link link-hover'>
                      忘记密码？
                    </a>
                  </label>
                )}
              </div>
              {isNewUser && (
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>邮箱验证码</span>
                  </label>
                  <input
                    type='text'
                    placeholder='验证码'
                    className='input input-bordered'
                    value={emailCode}
                    onChange={e => setEmailCode(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className='form-control'>
                <label className='cursor-pointer label'>
                  <span className='label-text'>创建新用户</span>
                  <input
                    type='checkbox'
                    className='checkbox checkbox-accent'
                    checked={isNewUser}
                    onChange={() => setIsNewUser(!isNewUser)}
                  />
                </label>
              </div>
              {isNewUser && (
                <div className='form-control mt-4'>
                  <button
                    type='button'
                    formNoValidate
                    className='btn btn-secondary'
                    onClick={async e => {
                      e.stopPropagation()
                      const response = await sendEmailCode(email)
                      if (response.success) {
                        setSuccess('验证码已发送')
                      } else {
                        setError(response.message)
                      }
                    }}
                  >
                    发送验证码
                  </button>
                </div>
              )}
              <div className='form-control mt-4'>
                <button className='btn btn-primary' type='submit'>
                  {isNewUser ? '创建账户' : '登录'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
