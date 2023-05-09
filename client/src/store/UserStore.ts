import { makeAutoObservable, autorun } from 'mobx'

const UserKey = 'User'

class UserStore {
  isLogin = false
  id = 0
  username = ''
  email = ''
  token = ''
  settings = {
    theme: 'light'
  }

  constructor() {
    makeAutoObservable(this)
    this._initFromLocalStorage()
    autorun(() => {
      this._saveUser()
    })
  }

  private _initFromLocalStorage() {
    const user = localStorage.getItem(UserKey)
    if (user) {
      try {
        const userObj = JSON.parse(user)
        if (userObj.token) {
          this.login(userObj, userObj.token)
          this.settings = userObj.settings
        }
        return
      } catch (error) {}
      this.logout()
    }
    this.logout()
  }

  private _saveUser() {
    localStorage.setItem(
      UserKey,
      JSON.stringify({
        id: this.id,
        username: this.username,
        email: this.email,
        token: this.token,
        settings: this.settings
      })
    )
  }

  login(user: { id: number; username: string; email: string }, token: string) {
    this.isLogin = true
    this.id = user.id
    this.username = user.username
    this.email = user.email
    this.token = token
  }

  logout() {
    this.isLogin = false
    this.id = 0
    this.username = ''
    this.email = ''
    this.token = ''
    localStorage.removeItem(UserKey)
  }

  setSettings(settings: typeof this.settings) {
    this.settings = settings
  }
}

const userStore = new UserStore()

export default userStore
