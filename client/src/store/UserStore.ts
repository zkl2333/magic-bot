import { makeAutoObservable } from 'mobx'

class UserStore {
  isLogin = false
  id = 0
  username = ''
  email = ''
  token = ''

  constructor() {
    makeAutoObservable(this)
  }

  login(user: { id: number; username: string; email: string }, token: string) {
    this.isLogin = true
    this.id = user.id
    this.username = user.username
    this.email = user.email
    this.token = token
    localStorage.setItem('token', token)
  }

  logout() {
    this.isLogin = false
    this.id = 0
    this.username = ''
    this.email = ''
    this.token = ''
    localStorage.removeItem('token')
  }
}

const userStore = new UserStore()

export default userStore
