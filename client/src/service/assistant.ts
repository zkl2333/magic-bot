import request from './request'

export type Assistant = {
  id: number | string
  name: string
  avatar: string | null
  isPublic: boolean
  config: {
    [key: string]: any
  } | null
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export type AssistantWithUsers = Assistant & {
  users: any[]
}

export type AssistantWithForks = Assistant & {
  forkedFrom: Assistant | null
  forkedFromId: number | null
  forks: Assistant[]
}

export type AssistantWithSyncInfo = Assistant & {
  lastSyncAt: Date | null
}

export type AssistantWithAllInfo = AssistantWithUsers & AssistantWithForks & AssistantWithSyncInfo

export const creatAssistant = async (
  assistantInfo: Pick<Assistant, 'name' | 'config' | 'description' | 'isPublic' | 'avatar'>
) => {
  const response = await request('/api/assistants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(assistantInfo)
  })

  const data = await response.json()

  if (!data.success) {
    throw new Error(response.message)
  }

  return data.assistant
}

export const getAssistants = async () => {
  const response = await request('/api/assistants', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  const data = await response.json()

  if (!data.success) {
    throw new Error(response.message)
  }
  return data.assistants
}

export const getPublicAssistants = async () => {
  const response = await request('/api/assistants/public', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  const data = await response.json()

  if (!data.success) {
    throw new Error(data.message)
  }
  return data.assistants.map(
    (
      assistant: Assistant & {
        config: string
      }
    ) => {
      return {
        ...assistant,
        config: assistant.config ? JSON.parse(assistant.config) : null
      }
    }
  )
}

export const deleteAssistant = async (assistantId: Assistant['id']) => {
  const response = await request(`/api/assistants/${assistantId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  const data = await response.json()

  if (!data.success) {
    throw new Error(data.message)
  }

  return data
}
