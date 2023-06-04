import { Form, useActionData, useOutletContext } from 'react-router-dom'

import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { RootContextProps } from '../../Root/Root'
import type { User } from '../../../service/user'
import classNames from 'classnames'
import userStore from '../../../store/UserStore'

const themes = [
  {
    name: '系统',
    value: 'auto'
  },
  {
    name: '暗色',
    value: 'dark'
  },
  {
    name: '亮色',
    value: 'light'
  }
]

const User = () => {
  const res = useActionData() as { error: any } | { message: string }
  const { enqueueSnackbar } = useSnackbar()
  const { setTitle } = useOutletContext<RootContextProps>()
  const [theme, setTheme] = useState(userStore.settings?.theme || 'auto')

  useEffect(() => {
    setTitle('个人信息')
    return () => {
      setTitle('')
    }
  }, [])

  useEffect(() => {
    if (res) {
      if ('error' in res) {
        enqueueSnackbar(res.error.message, {
          variant: 'error'
        })
      } else {
        enqueueSnackbar(res.message, {
          variant: 'success'
        })
      }
    }
  }, [res])

  return (
    <Form id='updateUserInfoForm' method='post' className='w-full flex-1 p-4'>
      <div className='mb-4'>
        <label className='block text-base-content font-semibold mb-1' htmlFor='username'>
          用户名:
        </label>
        <input
          className='input w-full my-1'
          type='text'
          id='username'
          name='username'
          defaultValue={userStore.username}
        />
        <p className='text-sm text-base-content opacity-50'>用户名是用户的唯一标识。</p>
      </div>
      <div className='mb-4'>
        <label className='block text-base-content font-semibold mb-1' htmlFor='nickname'>
          昵称:
        </label>
        <input
          className='input w-full my-1'
          type='text'
          id='nickname'
          name='nickname'
          defaultValue={userStore.nickname || ''}
        />
        <p className='text-sm text-base-content opacity-50'>
          昵称是用户的可选别名，用于显示在界面上，不需要唯一。
        </p>
      </div>
      <div className='mb-4'>
        <label className='block text-base-content font-semibold mb-1' htmlFor='email'>
          邮箱:
        </label>
        <input
          className='input w-full my-1'
          type='email'
          id='email'
          name='email'
          defaultValue={userStore.email}
        />
      </div>
      <div className='mb-4'>
        <label className='block text-base-content font-semibold mb-2'>主题:</label>
        <div className='flex items-center space-x-4'>
          {themes.map(themeItem => (
            <div key={themeItem.value} className='group'>
              <input
                className='mr-2 sr-only peer'
                type='radio'
                name='theme'
                value={themeItem.value}
                checked={themeItem.value === theme}
                onChange={() => setTheme(themeItem.value)}
                id={themeItem.value}
              />
              <label className='font-normal' htmlFor={themeItem.value} data-theme={themeItem.value}>
                <div
                  className={classNames(
                    'border-4 bg-base-100 text-base-content w-full cursor-pointer font-sans outline-base-content overflow-hidden rounded-lg text-left',
                    {
                      'border-primary': themeItem.value === theme,
                      'border-base-100': themeItem.value !== theme
                    }
                  )}
                >
                  <div className='grid grid-cols-5 grid-rows-3'>
                    <div className='col-span-5 row-span-3 row-start-1 flex gap-2 p-2 items-center'>
                      <div className='flex-grow text-sm font-bold'>{themeItem.name}</div>
                      <div className='flex flex-shrink-0 flex-wrap gap-1 h-full'>
                        <div className='bg-primary w-2 rounded'></div>
                        <div className='bg-secondary w-2 rounded'></div>
                        <div className='bg-accent w-2 rounded'></div>
                        <div className='bg-neutral w-2 rounded'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
      <button className='w-full bg-primary text-primary-content font-semibold px-4 py-2 rounded-md' type='submit'>
        保存
      </button>
    </Form>
  )
}

export default User
