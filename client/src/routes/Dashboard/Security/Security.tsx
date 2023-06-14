import { useEffect } from 'react'
import { ActionFunction, Form, useActionData, useOutletContext } from 'react-router-dom'
import { RootContextProps } from '../../Root'
import classNames from 'classnames'
import requestHandler from '@/service/request'
import { useSnackbar } from 'notistack'

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
    return {
      success: false,
      errors
    }
  }

  const res = await requestHandler('/api/users/me/password', {
    method: 'POST',
    body: JSON.stringify({
      oldPassword: currentPassword,
      newPassword: newPassword
    })
  })

  if (!res.success) {
    return {
      success: false,
      errors: {
        currentPassword: res.message
      }
    }
  }
  return {
    success: true,
    errors: null
  }
}

const Security = () => {
  const { setTitle } = useOutletContext<RootContextProps>()
  const actionData = useActionData() as {
    errors: Record<string, string>
    success: boolean
  } | null
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (actionData?.success) {
      enqueueSnackbar('修改成功', {
        variant: 'success'
      })
    }
  }, [actionData])

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
            ' input-error': actionData?.errors?.currentPassword
          })}
          type='password'
          id='currentPassword'
          name='currentPassword'
          placeholder='请输入当前密码'
        />
        {actionData?.errors?.currentPassword && (
          <p className='text-error text-sm'>{actionData?.errors?.currentPassword}</p>
        )}
      </div>
      <div className='mb-4'>
        <label className='block text-base-content font-semibold mb-1' htmlFor='newPassword'>
          新密码:
        </label>
        <input
          className={classNames('input w-full my-1', {
            ' input-error': actionData?.errors?.newPassword
          })}
          type='password'
          id='newPassword'
          name='newPassword'
          placeholder='请输入新密码'
        />
        {actionData?.errors?.newPassword && (
          <p className='text-error text-sm'>{actionData?.errors?.newPassword}</p>
        )}
      </div>
      <div className='mb-4'>
        <label className='block text-base-content font-semibold mb-1' htmlFor='confirmNewPassword'>
          确认新密码:
        </label>
        <input
          className={classNames('input w-full my-1', {
            ' input-error': actionData?.errors?.confirmNewPassword
          })}
          type='password'
          id='confirmNewPassword'
          name='confirmNewPassword'
          placeholder='请再次输入新密码。'
        />
        {actionData?.errors?.confirmNewPassword && (
          <p className='text-error text-sm'>{actionData?.errors?.confirmNewPassword}</p>
        )}
      </div>
      <button
        className='w-full bg-primary text-primary-content font-semibold px-4 py-2 rounded-md'
        type='submit'
      >
        保存
      </button>
    </Form>
  )
}

export default Security
