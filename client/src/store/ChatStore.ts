import { makeAutoObservable } from 'mobx'
import { ChatListItem } from '../types'

export class ChatStore {
  chatList: ChatListItem[] = [
    {
      exclude: true,
      role: 'assistant',
      message: '你好，有什么可以帮助你的吗？'
    }
  ]

  constructor() {
    makeAutoObservable(this)
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
  }

  get needChatList() {
    return this.chatList.filter(item => !item.exclude)
  }
}

const chatStore = new ChatStore()
export default chatStore
