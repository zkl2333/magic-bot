import { BaseMessage } from '../routes/Assistant/types'
import requestHandler from './request'

const formatAssistant = (assistant: any): Assistant => {
  return {
    ...assistant,
    forkedFrom: assistant.forkedFrom ? formatAssistant(assistant.forkedFrom) : null,
    config: assistant.config ? JSON.parse(assistant.config) : null
  }
}

export interface LocalAssistant {
  id: number
  interactionIds: string[]
}

export type Assistant = {
  id: number
  name: string
  author: {
    id: string
    username: string
    avatar: string | null
    nickname: string | null
  }
  avatar: string | null
  isPublic: boolean
  config: {
    model: string
    context_size: number
    temperature: number
    top_p: number
    max_tokens: number
    presence_penalty: number
    frequency_penalty: number
    initialMessage?: string
    prompt?: BaseMessage[]
  }
  description: string
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
  lastSyncAt: Date
}

export type AssistantWithLocal = Assistant & LocalAssistant

export type AssistantWithAllInfo = AssistantWithUsers & AssistantWithForks & AssistantWithSyncInfo

export const creatAssistant = async (
  assistantInfo: Pick<
    AssistantWithForks,
    'name' | 'config' | 'description' | 'isPublic' | 'avatar' | 'forkedFromId'
  >
) => {
  const data = await requestHandler('/api/users/me/assistants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(assistantInfo)
  })

  if (!data.success) {
    throw new Error(data.message)
  }

  return data.data
}

export const getAssistants = async () => {
  const data = await requestHandler('/api/users/me/assistants', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  if (!data.success) {
    throw new Error(data.message)
  }
  return data.data
}

export const getPublicAssistants = async () => {
  const data = await requestHandler('/api/assistants', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  if (!data.success) {
    throw new Error(data.message)
  }
  return data.data.map(
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
  const data = await requestHandler(`/api/users/me/assistants/${assistantId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  if (!data.success) {
    throw new Error(data.message)
  }

  return data
}

export const getAssistant = async (assistantId: Assistant['id']) => {
  const data = await requestHandler(`/api/users/me/assistants/${assistantId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  if (!data.success) {
    // throw new Error(data.message)
    return null
  }

  return formatAssistant(data.data)
}

export const updateAssistant = async (
  assistant: Pick<Assistant, 'id' | 'name' | 'config' | 'description' | 'isPublic' | 'avatar'>
) => {
  const data = await requestHandler(`/api/users/me/assistants/${assistant.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(assistant)
  })

  if (!data.success) {
    throw new Error(data.message)
  }

  return data.data
}
