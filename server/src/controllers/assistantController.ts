import { Context } from 'koa'
import { PrismaClient, Assistant } from '@prisma/client'

const prisma = new PrismaClient()

// 给自己创建一个助手
async function createAssistant(
  userId: string,
  assistantData: Pick<Assistant, 'name' | 'config' | 'description'>
) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw new Error('User not found')
  }

  // 创建助手
  const createdAssistant = await prisma.assistant.create({
    data: {
      name: assistantData.name,
      config: assistantData.config,
      description: assistantData.description
    }
  })

  // 将助手与用户关联
  await prisma.userAssistant.create({
    data: {
      user: { connect: { id: userId } },
      assistant: { connect: { id: createdAssistant.id } }
    }
  })

  return createdAssistant
}

// 列出我的助手
async function listAssistants(userId: string) {
  const userAssistants = await prisma.userAssistant.findMany({
    where: { userId },
    include: { assistant: true }
  })

  return userAssistants.map(userAssistant => userAssistant.assistant)
}

export const create = async (ctx: Context) => {
  const userId = ctx.state.user.id
  const assistantData = ctx.request.body as Assistant

  try {
    const assistant = await createAssistant(userId, assistantData)
    ctx.status = 200
    ctx.body = { message: '创建助手成功', assistant }
  } catch (error) {
    ctx.status = 400
    ctx.body = { message: '创建助手失败', error: (error as Error).message }
  }
}

const list = async (ctx: Context) => {
  const userId = ctx.state.user.id

  try {
    const assistants = await listAssistants(userId)
    ctx.status = 200
    ctx.body = { message: '获取助手列表成功', assistants }
  } catch (error) {
    ctx.status = 400
    ctx.body = { message: '获取助手列表失败', error: (error as Error).message }
  }
}

import Router from 'koa-router'

const assistantRouter = new Router({
  prefix: '/assistants'
})

assistantRouter.post('/', create)
assistantRouter.get('/', list)

export default assistantRouter
