type UUID = string

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

export interface Assistant {
  id: UUID
  name: string
  description: string
  avatar: string
  initialMessage?: string
  modelConfig: {
    model: string
    context_size: number
    temperature: number
    top_p: number
    max_tokens: number
    presence_penalty: number
    frequency_penalty: number
  }
  interactionIds: string[]
  prompt?: BaseMessage[]
}
