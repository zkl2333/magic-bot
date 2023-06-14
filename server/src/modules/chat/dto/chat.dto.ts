class MessageDto {
  id: string
  interactionId: string
  content: string
  role: 'user' | 'assistant'
}

class ConfigDto {
  model: string
  context_size: number
  temperature: number
  top_p: number
  max_tokens: number
  presence_penalty: number
  frequency_penalty: number
  initialMessage: string
}

export class ChatDto {
  messages: MessageDto[]
  config: ConfigDto
}
