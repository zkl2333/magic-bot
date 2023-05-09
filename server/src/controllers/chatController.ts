import { Context } from 'koa'
import completions from '../service/openai/completions'
import { Readable } from 'node:stream'
import WebStream from 'node:stream/web'
import { createStream, formatResponse } from '../utils'
import { ChatListItem } from '../types'

export const getCompletions = async (ctx: Context) => {
  const requestBody = ctx.request.body as { chatList: ChatListItem[] }
  if (typeof requestBody !== 'object' || !requestBody.chatList) {
    ctx.body = formatResponse({ msg: 'invalid request body' })
    return
  }
  const response = await completions(requestBody.chatList as ChatListItem[])
  const contentType = response.headers.get('Content-Type') ?? ''

  // streaming response
  if (contentType.includes('stream')) {
    // 检查响应状态
    if (response.ok) {
      if (response.body) {
        const stream = await createStream(response)
        ctx.status = response.status
        ctx.body = Readable.fromWeb(stream as WebStream.ReadableStream)
      }
    } else {
      ctx.body = await response.text()
    }
  } else {
    // try to parse error msg
    try {
      const mayBeErrorBody = await response.json()
      if (mayBeErrorBody.error) {
        console.error('[OpenAI Response] ', mayBeErrorBody)
        ctx.body = formatResponse(mayBeErrorBody)
      } else {
        ctx.set('Content-Type', 'application/json')
        ctx.set('Cache-Control', 'no-cache')
        ctx.body = JSON.stringify(mayBeErrorBody)
      }
    } catch (e) {
      console.error('[OpenAI Response] ', response)
      console.error('[OpenAI Parse] ', e)
      ctx.body = formatResponse({
        msg: 'invalid response from openai server',
        error: e
      })
    }
  }
}
