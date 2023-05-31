import { Context } from 'koa'
import * as jwt from 'jsonwebtoken'
import { PrismaClient, User } from '@prisma/client'
import { jwtSecret } from '../../constence'
import { fetchApiKey, getPointAccount } from '../../service/aiProxy'
import UserServices from '../../service/VerificationServices'

export const prisma = new PrismaClient()

export const generateToken = (user: User) => {
  const token = jwt.sign(
    {
      id: user.id
    },
    jwtSecret,
    { expiresIn: '3d' }
  )
  return token
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
    await fetchApiKey(id)
  }

  const userResponse = {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    settings: user.settings
  }

  ctx.status = 200
  ctx.body = {
    success: true,
    message: '获取用户信息成功',
    user: userResponse
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
