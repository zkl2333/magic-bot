import { Context } from 'koa'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 生成 JWT
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'

// 注册
export async function register(ctx: Context) {
  const { username, email, password } = ctx.request.body as Record<string, unknown>

  if (typeof email !== 'string' || typeof password !== 'string' || typeof username !== 'string') {
    ctx.status = 400
    ctx.body = { message: 'Invalid email or password format' }
    return
  }

  if (!email || !password) {
    ctx.status = 400
    ctx.body = { message: 'Email and password required' }
    return
  }

  const userExists = await prisma.user.findUnique({
    where: {
      email: email
    }
  })

  if (userExists) {
    ctx.status = 409
    ctx.body = { message: 'User already exists' }
    return
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email: email,
      username: email,
      password: hashedPassword
    }
  })

  ctx.status = 201
  ctx.body = { message: 'User registered successfully' }
}

// 登录 用户名和邮箱都可以登录
export async function login(ctx: Context) {
  const { email, username, password } = ctx.request.body as Record<string, unknown>

  if (!email && !username) {
    ctx.status = 400
    ctx.body = { message: 'Email or username required' }
    return
  }

  if (
    (email && typeof email !== 'string') ||
    (username && typeof username !== 'string') ||
    typeof password !== 'string'
  ) {
    ctx.status = 400
    ctx.body = { message: 'Invalid email, username or password format' }
    return
  }

  let user
  if (email) {
    user = await prisma.user.findUnique({
      where: {
        email: email as string
      }
    })
  } else {
    user = await prisma.user.findUnique({
      where: {
        username: username as string
      }
    })
  }

  if (!user) {
    ctx.status = 404
    ctx.body = { message: 'User not found' }
    return
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    ctx.status = 401
    ctx.body = { message: 'Invalid password' }
    return
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    jwtSecret,
    { expiresIn: '1h' }
  )

  ctx.status = 200
  ctx.body = { message: 'Logged in successfully', token }
}
