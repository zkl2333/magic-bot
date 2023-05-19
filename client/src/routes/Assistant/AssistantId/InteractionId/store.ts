import { makeAutoObservable } from 'mobx'
import { Message } from '../../types'

class ChatStore {
  messages: Message[] = []
  input = ''

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

  updateMessage(id: string, content: string) {
    const index = this.messages.findIndex(m => m.id === id)
    if (index !== -1) {
      this.messages[index] = {
        ...this.messages[index],
        content
      }
    }
  }
}

const chatStore = new ChatStore()
export default chatStore
