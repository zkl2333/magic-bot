import { Context } from 'koa'
import * as bcrypt from 'bcrypt'
import { prisma, generateToken } from '.'

// 注册
export default async function register(ctx: Context) {
  let { username, email, password } = ctx.request.body as Record<string, unknown>

  if (typeof email !== 'string' || typeof password !== 'string') {
    ctx.status = 400
    ctx.body = { message: '无效的邮箱或密码格式' }
    return
  }

  if (!email || !password) {
    ctx.status = 400
    ctx.body = { message: '需要邮箱和密码' }
    return
  }

  if (!/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email)) {
    ctx.status = 400
    ctx.body = { message: '无效的邮箱格式' }
    return
  }

  const userExists = await prisma.user.findUnique({
    where: {
      email: email
    }
  })

  if (userExists) {
    ctx.status = 409
    ctx.body = { message: '用户已存在' }
    return
  }

  if (username === undefined || username === '') {
    username = email
  }

  if (typeof username !== 'string') {
    ctx.status = 400
    ctx.body = { message: '无效的用户名格式' }
    return
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email: email,
      username: username,
      password: hashedPassword
    }
  })

  ctx.status = 201
  ctx.body = {
    message: '用户注册成功',
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    },
    token: generateToken(user)
  }
}
