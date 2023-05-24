import { Context } from 'koa'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { PrismaClient, User } from '@prisma/client'
import { jwtSecret } from '../constence'
import { getApiKey, getPointAccount } from '../service/aiProxy'

const prisma = new PrismaClient()

const generateToken = (user: User) => {
  const token = jwt.sign(
    {
      id: user.id
    },
    jwtSecret,
    { expiresIn: '3d' }
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

export async function userInfo(ctx: Context) {
  const { id } = ctx.state.user
  const withInfo = ctx.query.withInfo === 'true'

  const user = await prisma.user.findUnique({
    where: {
      id: id
    },
    select: {
      id: true,
      username: true,
      nickname: true,
      email: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
      platforms: {
        where: {
          platform: 'AI Proxy'
        }
      },
      settings: withInfo
    }
  })

  if (!user) {
    ctx.status = 404
    ctx.body = { success: false, message: '用户未找到' }
    return
  }

  if (user.platforms.length === 0) {
    const apiKey = await getApiKey(id)
    console.log('创建AI密钥', apiKey.slice(0, 8))
  }

  // delete user.platforms

  ctx.status = 200
  ctx.body = {
    success: true,
    message: '获取用户信息成功',
    user: user
  }
}

export async function updateUserInfo(ctx: Context) {
  const { id } = ctx.state.user
  const { username, nickname, email, settings } = ctx.request.body as {
    username?: string
    nickname?: string
    email?: string
    settings?: {
      theme: string
    }
  }

  const data: any = {}

  if (username || email) {
    const existingUsers = await prisma.user.findMany({
      where: {
        OR: [{ username }, { email }]
      }
    })

    const existingUsernameUser = existingUsers.find(user => user.username === username)
    const existingEmailUser = existingUsers.find(user => user.email === email)

    if (existingUsernameUser && existingUsernameUser.id !== id) {
      ctx.status = 400
      ctx.body = { message: '该用户名已被使用' }
      return
    }

    if (existingEmailUser && existingEmailUser.id !== id) {
      ctx.status = 400
      ctx.body = { message: '该邮箱已被其他用户绑定' }
      return
    }

    if (username) {
      data.username = username
    }

    if (nickname) {
      data.nickname = nickname
    }

    if (email) {
      data.email = email
    }
  }

  if (settings) {
    data.settings = {
      upsert: {
        create: settings,
        update: settings
      }
    }
  }

  try {
    await prisma.user.update({
      where: { id: id },
      data: data
    })
    ctx.status = 200
    ctx.body = { message: '更新用户信息成功' }
  } catch (error) {
    ctx.status = 400
    ctx.body = { message: '更新用户信息失败', error: (error as Error).message }
  }
}

export const getBalance = async (ctx: Context) => {
  const { id } = ctx.state.user

  const data = await getPointAccount(id)

  if (data === null) {
    ctx.status = 404
    ctx.body = {
      success: false,
      message: '获取用户余额失败'
    }
    return
  }

  ctx.status = 200
  ctx.body = {
    success: true,
    message: '获取用户余额成功',
    data: data
  }
}
