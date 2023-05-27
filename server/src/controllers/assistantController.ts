import { Context } from 'koa'
import { PrismaClient, Assistant } from '@prisma/client'
import Router from 'koa-router'

const prisma = new PrismaClient()

// 给自己创建一个助手
const createAssistant = async (
  userId: string,
  assistantData: Pick<Assistant, 'name' | 'config' | 'description'>
) => {
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
      config: JSON.stringify(assistantData.config),
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

// 列出公开的助手
const listPublicAssistants = () => {
  return prisma.assistant.findMany({
    where: { isPublic: true }
  })
}

// 删除我的助手
const deleteAssistant = (userId: string, assistantId: number) => {
  return prisma.userAssistant.delete({
    where: { userId_assistantId: { userId, assistantId } }
  })
}

export const create = async (ctx: Context) => {
  const userId = ctx.state.user.id
  const assistantData = ctx.request.body as Assistant

  try {
    const assistant = await createAssistant(userId, assistantData)
    ctx.status = 200
    ctx.body = { success: true, message: '创建助手成功', assistant }
  } catch (error) {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: '创建助手失败',
      error: (error as Error).message
    }
  }
}

const list = async (ctx: Context) => {
  const userId = ctx.state.user.id

  try {
    const assistants = await listAssistants(userId)
    ctx.status = 200
    ctx.body = {
      success: true,
      message: '获取助手列表成功',
      assistants
    }
  } catch (error) {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: '获取助手列表失败',
      error: (error as Error).message
    }
  }
}

const _delete = async (ctx: Context) => {
  const userId = ctx.state.user.id
  const assistantId = ctx.params.id

  try {
    await deleteAssistant(userId, +assistantId)
    ctx.status = 200
    ctx.body = {
      success: true,
      message: '删除助手成功'
    }
  } catch (error) {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: '删除助手失败',
      error: (error as Error).message
    }
  }
}

const publicList = async (ctx: Context) => {
  try {
    const assistants = await listPublicAssistants()
    ctx.status = 200
    ctx.body = {
      success: true,
      message: '获取公开助手列表成功',
      assistants
    }
  } catch (error) {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: '获取公开助手列表失败',
      error: (error as Error).message
    }
  }
}

const assistantRouter = new Router({
  prefix: '/assistants'
})

assistantRouter.post('/', create)
assistantRouter.get('/', list)
assistantRouter.get('/public', publicList)
assistantRouter.delete('/:id', _delete)

export default assistantRouter
