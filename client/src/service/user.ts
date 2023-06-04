import requestHandler from './request'

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

export const getUserInfo = async () => {
  const data = await requestHandler(`/api/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  if (!data.success) {
    throw new Error(data.message)
  }
  return data.data
}

export const updateUserInfo = async (
  userInfo:
    | Partial<User>
    | {
        settings: Partial<Settings>
      }
) => {
  return fetch('/api/users/me', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(userInfo)
  })
}

export const getBalance = async () => {
  return fetch('/api/users/me/balance', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
}

export const getPriceList = async () => {
  return fetch('/api/orders/price-list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
}
