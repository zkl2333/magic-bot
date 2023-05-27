import Router from 'koa-router'
import { Context } from 'koa'
import type { Assistant } from '@prisma/client'
import {
  createAssistant,
  listAssistants,
  deleteAssistant,
  listPublicAssistants,
  forkAssistant,
  getAssistant
} from '../controllers/assistantController'

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

const fork = async (ctx: Context) => {
  const userId = ctx.state.user.id
  const assistantId = ctx.params.id

  try {
    const assistant = await forkAssistant(userId, assistantId)
    ctx.status = 200
    ctx.body = {
      success: true,
      message: 'fork助手成功',
      assistant
    }
  } catch (error) {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: 'fork助手失败',
      error: (error as Error).message
    }
  }
}

const get = async (ctx: Context) => {
  const userId = ctx.state.user.id
  const assistantId = Number(ctx.params.id)

  try {
    const assistant = await getAssistant(userId, assistantId)

    if (!assistant) {
      throw new Error('助手不存在')
    }

    ctx.status = 200
    ctx.body = {
      success: true,
      message: '获取助手成功',
      assistant: assistant
    }
  } catch (error) {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: '获取助手失败',
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
assistantRouter.get('/:id', get)
assistantRouter.delete('/:id', _delete)
assistantRouter.post('/:id/fork', fork)

export default assistantRouter
