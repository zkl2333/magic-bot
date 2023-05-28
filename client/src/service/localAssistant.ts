import localforage from 'localforage'
import { deleteInteraction } from './interaction'
import { LocalAssistant } from './assistant'

export const addLocalAssistant = async (assistant: LocalAssistant): Promise<LocalAssistant> => {
  const newAssistant = {
    id: assistant.id,
    interactionIds: []
  }

  const assistants = await getLocalAllAssistantsIds()
  assistants.push(newAssistant.id)
  await localforage.setItem('assistantsIds', assistants)
  await localforage.setItem(`assistants.${newAssistant.id}`, newAssistant)
  return newAssistant
}

export const getLocalAllAssistantsIds = async (): Promise<Array<number | string>> => {
  return (await localforage.getItem('assistantsIds')) || []
}

export const getLocalAllAssistants = async (): Promise<LocalAssistant[]> => {
  const assistantsIds = await getLocalAllAssistantsIds()
  const assistants = await Promise.all(assistantsIds.map(id => localforage.getItem(`assistants.${id}`)))
  return assistants.filter((assistant): assistant is LocalAssistant => !!assistant)
}

export const getLocalAssistant = async (id: LocalAssistant['id']): Promise<LocalAssistant | null> => {
  return await localforage.getItem(`assistants.${id}`)
}

export const deleteLocalAssistant = async (assistantId: LocalAssistant['id']): Promise<void> => {
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

export const updateLocalAssistant = async (assistant: LocalAssistant): Promise<void> => {
  await localforage.setItem(`assistants.${assistant.id}`, assistant)
}
