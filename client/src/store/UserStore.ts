import { makeAutoObservable } from 'mobx'

interface User {
  id: string
  username: string
  nickname: string
  email: string
  token: string
  avatarUrl: string | null
  role: 'USER' | 'ADMIN'
  settings: {
    theme: string
  }
}

class UserStore {
  isLogin = false
  id = ''
  username = ''
  nickname = ''
  email = ''
  token = ''
  role: 'USER' | 'ADMIN' = 'USER'
  settings = { theme: 'light' }
  avatarUrl: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setUser(user: User) {
    this.isLogin = true
    const { id, username, email, avatarUrl, settings, role } = user
    this.id = id
    this.username = username
    this.nickname = username
    this.avatarUrl = avatarUrl
    this.email = email
    this.role = role
    if (settings) {
      this.settings = user.settings
    }
  }

  clear() {
    this.isLogin = false
    this.id = ''
    this.username = ''
    this.email = ''
    this.token = ''
  }
}

const userStore = new UserStore()

export default userStore
