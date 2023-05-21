import { Form, useActionData, useLoaderData, useOutletContext } from 'react-router-dom'
import { User, Settings } from '../service'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'
import { RootContextProps } from '../../Root/Root'

const User = () => {
  const { user } = useLoaderData() as { user: User & { settings: Settings | null } }
  const res = useActionData() as { error: any } | { message: string }
  const { enqueueSnackbar } = useSnackbar()

  const { setTitle } = useOutletContext<RootContextProps>()

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
        <label className='block text-gray-700 font-semibold' htmlFor='username'>
          用户名:
        </label>
        <input
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
          type='text'
          id='username'
          name='username'
          defaultValue={user.username}
        />
        <p className='text-sm text-gray-500'>用户名是用户的唯一标识。</p>
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700 font-semibold' htmlFor='nickname'>
          昵称:
        </label>
        <input
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
          type='text'
          id='nickname'
          name='nickname'
          defaultValue={user.nickname || ''}
        />
        <p className='text-sm text-gray-500'>昵称是用户的可选别名，用于显示在界面上，不需要唯一。</p>
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700 font-semibold' htmlFor='email'>
          邮箱:
        </label>
        <input
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
          type='email'
          id='email'
          name='email'
          defaultValue={user.email}
        />
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700 font-semibold' htmlFor='theme'>
          主题:
        </label>
        <input
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
          type='text'
          id='theme'
          name='theme'
          defaultValue={user.settings?.theme || ''}
        />
      </div>
      <button
        className='w-full bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600'
        type='submit'
      >
        保存
      </button>
    </Form>
  )
}

export default User
