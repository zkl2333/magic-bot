import { Context } from 'koa'
import chatCompletions from '../service/openai/chatCompletions'
import { Readable } from 'stream'

import { formatChatErrorResponse, chatCompletionsStreamFormatResponse, streamToString } from '../utils'
import { Message } from '../types'
import { getApiKey } from '../service/aiProxy'

export interface ChatCompletionRequest {
  messages: Message[]
  modelConfig: {
    model: string
    temperature: number
    top_p: number
    max_tokens: number
    presence_penalty: number
    frequency_penalty: number
  }
}

export const getCompletions = async (ctx: Context) => {
  const requestBody = ctx.request.body as ChatCompletionRequest
  const { id } = ctx.state.user

  if (typeof requestBody !== 'object' || !requestBody) {
    ctx.body = formatChatErrorResponse({ msg: '请求参数错误' })
    return
  }

  const apiKey = await getApiKey(id)

  try {
    const response = await chatCompletions(requestBody, apiKey)
    if (response.data instanceof Readable) {
      if (response.status === 200) {
        ctx.body = chatCompletionsStreamFormatResponse(response.data as unknown as Readable)
      } else {
        ctx.body = formatChatErrorResponse(await streamToString(response.data))
      }
    } else {
      if (response.status === 200) {
        ctx.body = response.data
      } else {
        ctx.body = JSON.stringify(response.data)
      }
    }
  } catch (error: any) {
    console.log(error)
    ctx.body = formatChatErrorResponse({
      msg: '服务端错误',
      error: error
    })
  }
}
