import Koa from 'koa'
import Router from 'koa-router'
import completions from './service/openai/completions'
import { Readable } from 'node:stream'
import WebStream from 'node:stream/web'
import { createStream, formatResponse } from './utils'

const app = new Koa()
const router = new Router()

const logger = async (ctx: Koa.Context, next: Koa.Next) => {
  console.log(`${ctx.method} ${ctx.url}`)
  await next()
}

router.get('/', async ctx => {
  ctx.body = 'Hello, Koa + TypeScript!'
})

router.post('/chat/completions', async ctx => {
  const response = await completions()
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
      console.error('[OpenAI Parse] ', e)
      ctx.body = formatResponse({
        msg: 'invalid response from openai server',
        error: e
      })
    }
  }
})

app.use(logger).use(router.routes()).use(router.allowedMethods())

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001')
})
