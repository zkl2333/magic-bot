import { ChatCompletionRequestMessageRoleEnum } from 'openai'

export type Message = {
  content: string
  role: ChatCompletionRequestMessageRoleEnum
}
