import { Assistant } from '../types'
import { setItem, getItem, removeItem } from './storage'
import { defaultAssistantList, modelConfig } from '../constants'
import { v4 as uuidv4 } from 'uuid'

export const initialize = async (): Promise<void> => {
  await setItem(
    'assistantsIds',
    defaultAssistantList.map(assistant => assistant.id)
  )
  await Promise.all(defaultAssistantList.map(assistant => setItem(`assistants.${assistant.id}`, assistant)))
}

export const addAssistant = async (assistantId?: string): Promise<Assistant> => {
  const id = assistantId || uuidv4()
  const assistant: Assistant = {
    id,
    name: 'New Assistant',
    description: 'New Assistant',
    avatar: '',
    initialMessage: 'Hello, I am a new assistant',
    modelConfig: modelConfig,
    interactionIds: []
  }

  const assistants = await getAllAssistantsIds()
  assistants.push(id)
  await setItem('assistantsIds', assistants)
  await setItem(`assistants.${id}`, assistant)
  return assistant
}

export const getAllAssistantsIds = async (): Promise<string[]> => {
  return (await getItem('assistantsIds')) || []
}

export const getAllAssistants = async (): Promise<Assistant[]> => {
  const assistantsIds = await getAllAssistantsIds()
  const assistants = await Promise.all(assistantsIds.map(id => getItem(`assistants.${id}`)))
  return assistants.filter((assistant): assistant is Assistant => !!assistant)
}

export const getAssistant = async (id: string): Promise<Assistant | null> => {
  return await getItem(`assistants.${id}`)
}

export const deleteAssistant = async (id: string): Promise<void> => {
  await removeItem(`assistants.${id}`)
}
