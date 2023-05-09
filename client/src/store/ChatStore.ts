import { makeAutoObservable } from 'mobx'
import { ChatListItem } from '../types'
import SessionsStore from './SessionsStore'

export class ChatStore {
  currentSessionId = ''
  chatList: ChatListItem[] = []

  constructor() {
    makeAutoObservable(this)
    this.initCurrentSession()
  }

  initCurrentSession() {
    const session = SessionsStore.sessions[0]
    if (session) {
      this.currentSessionId = session.id
      this.chatList = session.messages
    } else {
      this.currentSessionId = ''
      this.chatList = [
        {
          exclude: true,
          role: 'assistant',
          message: '你好，有什么可以帮助你的吗？'
        }
      ]
    }
  }

  addChatItem(chatItem: ChatListItem) {
    this.chatList.push(chatItem)
  }

  updateChatItem(index: number, chatItem: ChatListItem) {
    this.chatList[index] = chatItem
  }

  setAssistantMessage(message: string) {
    console.log('setAssistantMessage', message)
    const lastIndex = this.chatList.length - 1
    if (this.chatList[lastIndex].role === 'assistant') {
      this.chatList[lastIndex].message = message
    } else {
      this.chatList.push({
        message: message,
        role: 'assistant'
      })
    }
    if (this.currentSessionId) {
      SessionsStore.updateSession({ id: this.currentSessionId, messages: this.chatList })
    } else {
      this.currentSessionId = SessionsStore.addSession({
        title: this.needChatList.filter(item => item.role === 'user')[0]?.message,
        messages: this.chatList
      })
    }
  }

  get needChatList() {
    return this.chatList.filter(item => !item.exclude)
  }

  changeCurrentSession(id: string) {
    this.currentSessionId = id
    const session = SessionsStore.sessions.find(item => item.id === id)
    if (session) {
      this.chatList = session.messages
    }
  }
}

const chatStore = new ChatStore()
export default chatStore
