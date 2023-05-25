import { Assistant } from '../types'
import { defaultAssistantList, modelConfig } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import localforage from 'localforage'
import { deleteInteraction } from './interaction'

export const initialize = async (): Promise<void> => {
  await localforage.setItem(
    'assistantsIds',
    defaultAssistantList.map(assistant => assistant.id)
  )
  await Promise.all(
    defaultAssistantList.map(assistant => localforage.setItem(`assistants.${assistant.id}`, assistant))
  )
}

export const addAssistant = async (assistant?: Assistant): Promise<Assistant> => {
  const newAssistant = assistant || {
    id: uuidv4(),
    name: 'New Assistant',
    description: 'New Assistant',
    avatar: '',
    initialMessage: 'Hello, I am a new assistant',
    modelConfig: modelConfig,
    interactionIds: []
  }

  const assistants = await getAllAssistantsIds()
  assistants.push(newAssistant.id)
  await localforage.setItem('assistantsIds', assistants)
  await localforage.setItem(`assistants.${newAssistant.id}`, newAssistant)
  return newAssistant
}

export const getAllAssistantsIds = async (): Promise<string[]> => {
  return (await localforage.getItem('assistantsIds')) || []
}

export const getAllAssistants = async (): Promise<Assistant[]> => {
  const assistantsIds = await getAllAssistantsIds()
  const assistants = await Promise.all(assistantsIds.map(id => localforage.getItem(`assistants.${id}`)))
  return assistants.filter((assistant): assistant is Assistant => !!assistant)
}

export const getAssistant = async (id: string): Promise<Assistant | null> => {
  return await localforage.getItem(`assistants.${id}`)
}

export const deleteAssistant = async (assistantId: Assistant['id']): Promise<void> => {
  const assistant = await getAssistant(assistantId)
  const needInteractionIds: string[] = []
  if (assistant) {
    assistant.interactionIds.forEach(interactionId => {
      needInteractionIds.push(interactionId)
    })
  }
  const assistantsIds = await getAllAssistantsIds()
  await localforage.setItem(
    'assistantsIds',
    assistantsIds.filter(id => id !== assistantId)
  )
  await localforage.removeItem(`assistants.${assistantId}`)
  await Promise.all(needInteractionIds.map(key => deleteInteraction(key)))
}

export const updateAssistant = async (assistant: Assistant): Promise<void> => {
  await localforage.setItem(`assistants.${assistant.id}`, assistant)
}
