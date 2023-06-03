export interface BaseMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface Message extends BaseMessage {
  id: string
  interactionId: string
  createdAt: number
  updatedAt: number
  loading?: boolean
}

export interface Interaction {
  id: string
  assistantId: number
  title: string
  createdAt: number
  messageIds: string[]
}
