import { ChatCompletionRequestMessageRoleEnum } from "openai"

export type ChatListItem = {
  message: string
  role: ChatCompletionRequestMessageRoleEnum
}
