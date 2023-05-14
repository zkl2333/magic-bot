import { Context } from 'koa'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { PrismaClient, User } from '@prisma/client'
import { jwtSecret } from '../constence'

const prisma = new PrismaClient()

const generateToken = (user: User) => {
  const token = jwt.sign(
    {
      id: user.id
    },
    jwtSecret,
    { expiresIn: '15d' }
  )
  return token
}

// 注册
export async function register(ctx: Context) {
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

// 登录 用户名和邮箱都可以登录
export async function login(ctx: Context) {
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

// 验证 JWT
export async function verify(ctx: Context) {
  const token = ctx.request.headers.authorization?.split(' ')[1]

  if (!token) {
    ctx.status = 400
    ctx.body = { message: 'Token required' }
    return
  }

  try {
    const decoded = jwt.verify(token as string, jwtSecret)
    ctx.status = 200
    ctx.body = { message: 'Token verified', verified: true }
  } catch (error) {
    ctx.status = 401
    ctx.body = { message: 'Invalid token', verified: false, error }
  }
}
