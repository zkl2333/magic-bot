import Koa from 'koa'

const logger = async (ctx: Koa.Context, next: Koa.Next) => {
  console.log(`${ctx.method} ${ctx.url}`)
  await next()
}

export default logger
