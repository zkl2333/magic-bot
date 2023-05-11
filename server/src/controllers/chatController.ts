import { Context } from 'koa'
import chatCompletions from '../service/openai/completions'
import { Readable } from 'stream'

import { formatChatErrorResponse, chatCompletionsStreamFormatResponse, streamToString } from '../utils'
import { ChatListItem } from '../types'

export const getCompletions = async (ctx: Context) => {
  const requestBody = ctx.request.body as { chatList: ChatListItem[] }
  if (typeof requestBody !== 'object' || !requestBody.chatList) {
    ctx.body = formatChatErrorResponse({ msg: '请求参数错误' })
    return
  }
  try {
    const response = await chatCompletions(requestBody.chatList as ChatListItem[])
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
