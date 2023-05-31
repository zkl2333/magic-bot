import { Context } from 'koa'
import * as bcrypt from 'bcrypt'
import { prisma, generateToken } from '.'
import VerificationServices from '../../service/VerificationServices'

// 注册
export default async function register(ctx: Context) {
  let { username, email, password, emailCode } = ctx.request.body as Record<string, unknown>

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

  if (!emailCode || typeof emailCode !== 'string') {
    ctx.status = 400
    ctx.body = { message: '需要邮箱验证码' }
    return
  }

  // 验证邮箱验证码
  try {
    await VerificationServices.verifyEmail(email, emailCode)
  } catch (error) {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: (error as Error).message
    }
    return
  }

  // 验证邮箱是否已被注册
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
      password: hashedPassword,
      emailVerified: true
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
