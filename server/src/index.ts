import Koa from 'koa'
import Router from 'koa-router'

const app = new Koa()
const router = new Router()

router.get('/', async ctx => {
  ctx.body = 'Hello, Koa + TypeScript!'
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001')
})
