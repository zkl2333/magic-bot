import { Assistant } from '../routes/Assistant/types'
import { defaultAssistantList, config } from '../routes/Assistant/constants'
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

export const addLocalAssistant = async (assistant?: Assistant): Promise<Assistant> => {
  const newAssistant = assistant || {
    id: uuidv4(),
    name: 'New Assistant',
    description: 'New Assistant',
    avatar: '',
    initialMessage: 'Hello, I am a new assistant',
    config: config,
    interactionIds: []
  }

  const assistants = await getLocalAllAssistantsIds()
  assistants.push(newAssistant.id)
  await localforage.setItem('assistantsIds', assistants)
  await localforage.setItem(`assistants.${newAssistant.id}`, newAssistant)
  return newAssistant
}

export const getLocalAllAssistantsIds = async (): Promise<string[]> => {
  return (await localforage.getItem('assistantsIds')) || []
}

export const getLocalAllAssistants = async (): Promise<Assistant[]> => {
  const assistantsIds = await getLocalAllAssistantsIds()
  const assistants = await Promise.all(assistantsIds.map(id => localforage.getItem(`assistants.${id}`)))
  return assistants.filter((assistant): assistant is Assistant => !!assistant)
}

export const getLocalAssistant = async (id: string): Promise<Assistant | null> => {
  return await localforage.getItem(`assistants.${id}`)
}

export const deleteLocalAssistant = async (assistantId: Assistant['id']): Promise<void> => {
  console.log('deleteLocalAssistant', assistantId)
  const assistant = await getLocalAssistant(assistantId)
  const needInteractionIds: string[] = []
  if (assistant) {
    assistant.interactionIds.forEach(interactionId => {
      needInteractionIds.push(interactionId)
    })
  }
  const assistantsIds = await getLocalAllAssistantsIds()
  await localforage.setItem(
    'assistantsIds',
    assistantsIds.filter(id => id !== assistantId)
  )
  await localforage.removeItem(`assistants.${assistantId}`)
  await Promise.all(needInteractionIds.map(key => deleteInteraction(key)))
}

export const updateLocalAssistant = async (assistant: Assistant): Promise<void> => {
  await localforage.setItem(`assistants.${assistant.id}`, assistant)
}
