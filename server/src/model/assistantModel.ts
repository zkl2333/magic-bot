import { PrismaClient, Assistant } from '@prisma/client'

const prisma = new PrismaClient()

// 给自己创建一个助手
export const createAssistant = async (userId: string, assistantData: Omit<Assistant, 'id'>) => {
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
      description: assistantData.description,
      avatar: assistantData.avatar,
      isPublic: assistantData.isPublic,
      forkedFromId: assistantData.forkedFromId,
      config: JSON.stringify(assistantData.config)
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

// fork一个公开的助手
export const forkAssistant = async (userId: string, assistantId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw new Error('User not found')
  }

  const assistant = await prisma.assistant.findUnique({
    where: { id: assistantId }
  })

  if (!assistant) {
    throw new Error('Assistant not found')
  }

  // 创建助手
  const createdAssistant = await prisma.assistant.create({
    data: {
      name: assistant.name,
      config: assistant.config,
      description: assistant.description,
      forkedFromId: assistant.id,
      isPublic: false
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
export async function listAssistants(userId: string) {
  const userAssistants = await prisma.userAssistant.findMany({
    where: { userId },
    include: { assistant: true }
  })

  return userAssistants.map(userAssistant => userAssistant.assistant)
}

// 列出公开的助手
export const listPublicAssistants = () => {
  return prisma.assistant.findMany({
    where: { isPublic: true }
  })
}

// 删除我的助手
export const deleteAssistant = async (userId: string, assistantId: number) => {
  // 判断是不是自己的
  const userAssistant = await prisma.userAssistant.findUnique({
    where: {
      userId_assistantId: { userId, assistantId }
    }
  })

  if (!userAssistant) {
    throw new Error('User assistant not found')
  }

  return prisma.assistant.delete({
    where: {
      id: assistantId
    }
  })
}

// 获取助手
export const getAssistant = async (userId: string, assistantId: number) => {
  const assistant = await prisma.userAssistant.findUnique({
    where: {
      userId_assistantId: { userId, assistantId }
    },
    include: { assistant: true }
  })

  if (!assistant) {
    return null
  }

  return assistant.assistant
}

// 更新助手
export const updateAssistant = async (
  userId: string,
  assistantId: number,
  assistantData: Partial<Assistant>
) => {
  const assistant = await prisma.userAssistant.findUnique({
    where: {
      userId_assistantId: { userId, assistantId }
    },
    include: { assistant: true }
  })

  if (!assistant) {
    return null
  }

  return prisma.assistant.update({
    where: { id: assistantId },
    data: {
      name: assistantData.name,
      description: assistantData.description,
      avatar: assistantData.avatar,
      isPublic: assistantData.isPublic,
      config: JSON.stringify(assistantData.config)
    }
  })
}
