import { makeAutoObservable } from 'mobx'

interface User {
  id: number
  username: string
  nickname: string
  email: string
  token: string
  avatarUrl: string | null
  settings: {
    theme: string
  }
}

class UserStore {
  isLogin = false
  id = 0
  username = ''
  nickname = ''
  email = ''
  token = ''
  settings = { theme: 'light' }
  avatarUrl: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setUser(user: User) {
    const { id, username, email, avatarUrl, settings } = user
    this.id = id
    this.username = username
    this.nickname = username
    this.avatarUrl = avatarUrl
    this.email = email
    if (settings) {
      this.settings = user.settings
    }
  }

  clear() {
    this.isLogin = false
    this.id = 0
    this.username = ''
    this.email = ''
    this.token = ''
  }
}

const userStore = new UserStore()

export default userStore
