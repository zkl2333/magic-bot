import { Context } from 'koa'
import * as bcrypt from 'bcrypt'
import { generateToken } from '.'
import { prisma } from '../../service/userServices'

// 登录 用户名和邮箱都可以登录
export default async function login(ctx: Context) {
  const { usernameOrEmail, password } = ctx.request.body as Record<string, unknown>

  if (!usernameOrEmail) {
    ctx.status = 400
    ctx.body = { message: '需要用户名或电子邮件' }
    return
  }

  if (typeof usernameOrEmail !== 'string' || typeof password !== 'string') {
    ctx.status = 400
    ctx.body = { message: '无效的用户名/电子邮件或密码格式' }
    return
  }

  let user
  if (usernameOrEmail.includes('@')) {
    user = await prisma.user.findUnique({
      where: {
        email: usernameOrEmail
      }
    })
  } else {
    user = await prisma.user.findUnique({
      where: {
        username: usernameOrEmail
      }
    })
  }

  if (!user) {
    ctx.status = 404
    ctx.body = { message: '用户未找到' }
    return
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    ctx.status = 401
    ctx.body = { message: '无效的密码' }
    return
  }

  const token = generateToken(user)

  ctx.status = 200
  ctx.body = {
    message: '登录成功',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  }
}
