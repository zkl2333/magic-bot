export interface BaseMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface Message extends BaseMessage {
  id: string
  interactionId: string
  createdAt: number
  updatedAt: number
}

export interface Interaction {
  id: string
  assistantId: string
  title: string
  createdAt: number
  messageIds: string[]
}
