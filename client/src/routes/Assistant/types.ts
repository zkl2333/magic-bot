type UUID = string

export interface Message {
  id: string
  interactionId: string
  text: string
  timestamp: number
}

export interface Interaction {
  id: string
  assistantId: string
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
}
