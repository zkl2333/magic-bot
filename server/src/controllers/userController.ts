import { Context } from 'koa'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

// 生成 JWT
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'

const generateToken = (user: User) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email
    },
    jwtSecret,
    { expiresIn: '15d' }
  )
  return token
}

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

  const user = await prisma.user.create({
    data: {
      email: email,
      username: username,
      password: hashedPassword
    }
  })

  ctx.status = 201
  ctx.body = {
    message: 'User registered successfully',
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

  const token = generateToken(user)

  ctx.status = 200
  ctx.body = {
    message: 'Logged in successfully',
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
