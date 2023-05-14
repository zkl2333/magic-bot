import { useState } from 'react'
import userStore from '../../store/UserStore'
import LoginImg from './login.jpg'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'

const Login = () => {
  const [isNewUser, setIsNewUser] = useState(false)
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

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
    const response = await fetch('/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usernameOrEmail, password })
    })
    const data = await response.json()
    if (response.ok) {
      userStore.login(data.user, data.token)
      setSuccess(data.message)
      navigate('/', { replace: true })
    } else {
      setError(data.message)
    }
  }

  const register = async () => {
    if (!verify()) return
    const response = await fetch('/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: usernameOrEmail, password })
    })
    const data = await response.json()
    if (response.ok) {
      userStore.login(data.user, data.token)
      setSuccess(data.message)
      navigate('/', { replace: true })
    } else {
      setError(data.message)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isNewUser) {
      register()
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
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>{isNewUser ? '电子邮件' : '电子邮件/用户名'}</span>
                </label>
                <input
                  type='text'
                  placeholder={isNewUser ? '电子邮件' : '电子邮件/用户名'}
                  className='input input-bordered'
                  value={usernameOrEmail}
                  onChange={e => setUsernameOrEmail(e.target.value)}
                  required
                />
              </div>
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
                <label className='label'>
                  <a href='#' className='label-text-alt link link-hover'>
                    忘记密码？
                  </a>
                </label>
              </div>
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
