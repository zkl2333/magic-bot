import { useEffect } from 'react'
import { ActionFunction, Form, useActionData, useOutletContext } from 'react-router-dom'
import { RootContextProps } from '../../Root/Root'
import classNames from 'classnames'
import requestHandler from '@/service/request'

export const changePasswordAction: ActionFunction = async ({ request }) => {
  let formData = await request.formData()
  const data = Object.fromEntries(formData.entries())
  const { currentPassword, newPassword, confirmNewPassword } = data
  const errors: Record<string, string> = {}

  if (!currentPassword) {
    errors['currentPassword'] = '当前密码不能为空'
  }

  if (!newPassword) {
    errors['newPassword'] = '新密码不能为空'
  }

  if (!confirmNewPassword) {
    errors['confirmNewPassword'] = '确认新密码不能为空'
  }

  if (newPassword !== confirmNewPassword) {
    errors['confirmNewPassword'] = '两次输入的密码不一致'
  }

  if (Object.keys(errors).length) {
    return errors
  }

  const res = await requestHandler('/api/user/password', {
    method: 'POST',
    body: JSON.stringify({
      oldPassword: currentPassword,
      newPassword: newPassword
    })
  })

  if (!res.success) {
    return {
      currentPassword: res.message
    }
  }
  return null
}

const Security = () => {
  const { setTitle } = useOutletContext<RootContextProps>()
  const errors = useActionData() as Record<string, string> | undefined

  console.log(errors)

  useEffect(() => {
    setTitle('安全设置')
    return () => {
      setTitle('')
    }
  }, [])

  return (
    <Form method='post' className='w-full flex-1 p-4'>
      <div className='text-xl font-bold mb-4'>安全设置</div>
      <div className='mb-4'>
        <label className={'block text-base-content font-semibold mb-1'} htmlFor='currentPassword'>
          当前密码:
        </label>
        <input
          className={classNames('input w-full my-1', {
            ' input-error': errors?.currentPassword
          })}
          type='password'
          id='currentPassword'
          name='currentPassword'
          placeholder='请输入当前密码'
        />
        {errors?.currentPassword && <p className='text-error text-sm'>{errors?.currentPassword}</p>}
      </div>
      <div className='mb-4'>
        <label className='block text-base-content font-semibold mb-1' htmlFor='newPassword'>
          新密码:
        </label>
        <input
          className={classNames('input w-full my-1', {
            ' input-error': errors?.newPassword
          })}
          type='password'
          id='newPassword'
          name='newPassword'
          placeholder='请输入新密码'
        />
        {errors?.newPassword && <p className='text-error text-sm'>{errors?.newPassword}</p>}
      </div>
      <div className='mb-4'>
        <label className='block text-base-content font-semibold mb-1' htmlFor='confirmNewPassword'>
          确认新密码:
        </label>
        <input
          className={classNames('input w-full my-1', {
            ' input-error': errors?.confirmNewPassword
          })}
          type='password'
          id='confirmNewPassword'
          name='confirmNewPassword'
          placeholder='请再次输入新密码。'
        />
        {errors?.confirmNewPassword && <p className='text-error text-sm'>{errors?.confirmNewPassword}</p>}
      </div>
      <button className='w-full bg-primary text-white font-semibold px-4 py-2 rounded-md' type='submit'>
        保存
      </button>
    </Form>
  )
}

export default Security
