import { makeAutoObservable } from 'mobx'
import { v4 as uuidv4, validate as uuidValidate } from 'uuid'
import { ChatListItem } from '../types'

interface Session {
  id: string
  title?: string
  messages: ChatListItem[]
}

class SessionsStore {
  sessions: Session[] = []
  constructor() {
    const sessions = localStorage.getItem('sessions')
    if (sessions) {
      try {
        this.sessions = JSON.parse(sessions)
      } catch (error) {}
    }
    makeAutoObservable(this)
  }

  createSession() {
    const id = uuidv4()
    this.sessions.push({
      id,
      messages: [
        {
          exclude: true,
          role: 'assistant',
          message: '你好，有什么可以帮助你的吗？'
        }
      ]
    })
    localStorage.setItem('sessions', JSON.stringify(this.sessions))
    return id
  }

  addSession({ title, messages }: { title: string; messages: ChatListItem[] }) {
    const id = uuidv4()
    this.updateSession({ id, title, messages })
    return id
  }

  updateSession({ id, title, messages }: { id: string; title?: string; messages: ChatListItem[] }) {
    const session = this.sessions.find(item => item.id === id)
    if (session) {
      session.title = title
      session.messages = messages
    } else if (uuidValidate(id)) {
      this.sessions.push({
        id,
        title,
        messages
      })
    }
    localStorage.setItem('sessions', JSON.stringify(this.sessions))
  }

  deleteSession(id: string) {
    const index = this.sessions.findIndex(item => item.id === id)
    if (index >= 0) {
      this.sessions.splice(index, 1)
      localStorage.setItem('sessions', JSON.stringify(this.sessions))
    }
  }
}

const sessionsStore = new SessionsStore()
export default sessionsStore
