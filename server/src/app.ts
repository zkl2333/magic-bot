import Koa, { DefaultContext, DefaultState } from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { getCompletions } from './controllers/chatController'
import { register, login } from './controllers/userController'
import { Prisma } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()
const app = new Koa<DefaultState, DefaultContext>()
const router = new Router()

const logger = async (ctx: Koa.Context, next: Koa.Next) => {
  console.log(`${ctx.method} ${ctx.url}`)
  await next()
}

// 自定义 Prisma 错误处理中间件
const prismaErrorHandler = async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    await next()
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      ctx.status = 400
      ctx.body = {
        success: false,
        message: `Prisma error: ${error.message}`
      }
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      ctx.status = 500
      ctx.body = {
        success: false,
        message: `Unknown Prisma error: ${error.message}`
      }
    } else {
      ctx.status = 500
      if (error instanceof Error) {
        ctx.body = {
          success: false,
          message: `Error: ${error.message}`
        }
      } else {
        ctx.body = {
          success: false,
          message: `Error: ${error}`
        }
      }
    }
  }
}

router.get('/', async ctx => {
  ctx.body = 'Hello, Koa + TypeScript!'
})

// 用户注册和登录
router.post('/register', register)
router.post('/login', login)

router.post('/chat/completions', getCompletions)

app.use(logger).use(prismaErrorHandler).use(bodyParser()).use(router.routes()).use(router.allowedMethods())

export default app
