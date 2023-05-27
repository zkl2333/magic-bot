import request from './request'

export type Assistant = {
  id: number | string
  name: string
  avatar: string | null
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

export const pushAssistant = async (assistantInfo: Pick<Assistant, 'name' | 'config' | 'description'>) => {
  return request('/api/assistants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(assistantInfo)
  })
}

export const getAssistants = async () => {
  const assistants = await request('/api/assistants', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  const res = await assistants.json()

  if (!res.success) {
    throw new Error(res.message)
  }
  return res.assistants
}

export const getPublicAssistants = async () => {
  const assistants = await request('/api/assistants/public', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  const res = await assistants.json()

  if (!res.success) {
    throw new Error(res.message)
  }
  return res.assistants
}
