import userStore from '../store/UserStore'
import request from './request'

/**
 * Model User
 *
 */
export type User = {
  id: number
  email: string
  username: string
  nickname: string | null
  password: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Model Settings
 *
 */
export type Settings = {
  id: number
  userId: number
  theme: string | null
  createdAt: Date
  updatedAt: Date
}

export const getUserInfo = async ({ withInfo }: { withInfo?: boolean } = {}) => {
  const user = await request(`/api/user/info`, {
    method: 'GET',
    query: {
      withInfo: !!withInfo
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userStore.token}`
    }
  })

  const res = await user.json()

  if (!res.success) {
    throw new Error(res.message)
  }
  return res.user
}

export const updateUserInfo = async (
  userInfo:
    | Partial<User>
    | {
        settings: Partial<Settings>
      }
) => {
  return fetch('/api/user/info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userStore.token}`
    },
    body: JSON.stringify(userInfo)
  })
}

export const getBalance = async () => {
  return fetch('/api/user/balance', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userStore.token}`
    }
  })
}
