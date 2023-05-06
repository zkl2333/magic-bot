import { makeAutoObservable } from 'mobx'
import { ChatListItem } from '../types'

export class ChatStore {
  chatList: ChatListItem[] = []

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
}

export const chatStore = new ChatStore()
