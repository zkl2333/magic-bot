import { makeAutoObservable } from 'mobx'
import { ChatListItem } from '../types'

export class ChatStore {
  chatList: ChatListItem[] = [
    {
      message: '多多是不是世界上最可爱的人',
      rule: 'user'
    },
    {
      message: '是的, 多多是世界上最可爱的人',
      rule: 'assistant'
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
    if (this.chatList[lastIndex].rule === 'assistant') {
      this.chatList[lastIndex].message = message
    } else {
      this.chatList.push({
        message: message,
        rule: 'assistant'
      })
    }
  }
}

export const chatStore = new ChatStore()
