import Koa from 'koa'
import { Prisma } from '@prisma/client'

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
      console.log(error)
      throw error
    }
  }
}

export default prismaErrorHandler
