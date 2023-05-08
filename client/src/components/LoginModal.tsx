import classnames from 'classnames'
import { useState } from 'react'
import modalStore, { IModalProps } from '../store/ModalStore'
import userStore from '../store/UserStore'

type LoginModalProps = IModalProps

const LoginModal: React.FC<LoginModalProps> = ({ visible, close }) => {
  // 登录或注册
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const verify = () => {
    if (!username) {
      setError('用户名不能为空')
      return false
    }
    if (!password) {
      setError('密码不能为空')
      return false
    }
    if (isRegister && !email) {
      setError('邮箱不能为空')
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
      body: JSON.stringify({ username, password })
    })
    const data = await response.json()
    if (response.ok) {
      userStore.login(data.user, data.token)
      close()
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
      body: JSON.stringify({ username, password, email })
    })
    const data = await response.json()
    if (response.ok) {
      userStore.login(data.user, data.token)
      close()
    } else {
      setError(data.message)
    }
  }

  return (
    <>
      <input checked={visible} type='checkbox' readOnly className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg text-center'>
            {isRegister ? '注册一个新的账户' : '需要登录才能使用哦'}
          </h3>
          <div className='pt-4'>
            <div className={classnames('flex', 'flex-row', 'justify-between', 'items-center', 'mb-2')}>
              <label htmlFor='username' className='mr-2 w-14 text-right'>
                用户名
              </label>
              <input
                type='text'
                id='username'
                placeholder='请输入用户名'
                className={classnames('flex-1', 'input', 'input-bordered')}
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            {isRegister && (
              <div className={classnames('flex', 'flex-row', 'justify-between', 'items-center', 'mb-2')}>
                <label htmlFor='email' className='mr-2  w-14 text-right'>
                  邮箱
                </label>
                <input
                  type='text'
                  placeholder='请输入邮箱'
                  id='email'
                  className={classnames('flex-1', 'input', 'input-bordered')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            )}
            <div className={classnames('flex', 'flex-row', 'justify-between', 'items-center', 'mb-4')}>
              <label htmlFor='password' className='mr-2  w-14 text-right'>
                密码
              </label>
              <input
                type='password'
                id='password'
                placeholder='请输入密码'
                className={classnames('flex-1', 'input', 'input-bordered')}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {/* 警告 */}
            {error && (
              <div className='alert alert-error shadow-lg'>
                <div>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='stroke-current flex-shrink-0 h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
            {/* 切换 */}
            <div className='flex flex-row justify-between items-center'>
              {isRegister ? (
                <div className='btn btn-link no-underline text-base-content' onClick={() => setIsRegister(false)}>
                  已有账号？点击登录
                </div>
              ) : (
                <div className='btn btn-link no-underline text-base-content' onClick={() => setIsRegister(true)}>
                  没有账号？点击注册
                </div>
              )}
              <label className='btn btn-link no-underline text-base-content'>忘记密码？</label>
            </div>
          </div>
          <div className='modal-action'>
            <label className='btn' onClick={isRegister ? register : login}>
              {isRegister ? '注册' : '登录'}
            </label>
          </div>
        </div>
      </div>
    </>
  )
}

export const openLoginModal = () => {
  return modalStore.openModal(LoginModal, {})
}
