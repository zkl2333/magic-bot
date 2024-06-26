import { makeAutoObservable } from 'mobx'
import { Message } from '../../types'

class ChatStore {
  messages: Message[] = []
  input = ''
  loading = false

  constructor() {
    makeAutoObservable(this)
  }

  setMessages(messages: Message[]) {
    this.messages = messages
  }

  setInput(input: string) {
    this.input = input
  }

  addMessage(message: Message) {
    this.messages.push(message)
  }

  removeMessage(id: string) {
    const index = this.messages.findIndex(m => m.id === id)
    if (index !== -1) {
      this.messages.splice(index, 1)
    }
  }

  removeMessages(ids: string[]) {
    this.messages = this.messages.filter(m => !ids.includes(m.id))
  }

  updateMessage(id: string, content: string) {
    const index = this.messages.findIndex(m => m.id === id)
    if (index !== -1) {
      this.messages[index] = {
        ...this.messages[index],
        content
      }
    }
  }

  setMessagesLoading(id: string, loading: boolean) {
    const index = this.messages.findIndex(m => m.id === id)
    if (index !== -1) {
      this.messages[index] = {
        ...this.messages[index],
        loading
      }
    }
  }

  setLoading(loading: boolean) {
    this.loading = loading
    if (loading === false) {
      this.messages = this.messages.map(m => ({
        ...m,
        loading: false
      }))
    }
  }
}

const chatStore = new ChatStore()
export default chatStore
