import { Interaction } from '../types'
import { setItem, getItem, removeItem } from './storage'
import { getAssistant } from './assistant'
import { v4 as uuidv4 } from 'uuid'

export const addInteraction = async (assistantId: string, interactionId?: string): Promise<Interaction> => {
  const id = interactionId || uuidv4()
  const interaction: Interaction = {
    id,
    title: '',
    assistantId,
    messageIds: [],
    createdAt: Date.now()
  }

  const assistant = await getAssistant(assistantId)
  if (assistant) {
    assistant.interactionIds.push(id)
    await setItem(`assistants.${assistantId}`, assistant)
    await setItem(`interactions.${id}`, interaction)
  }

  return interaction
}

export const getInteraction = async (id: string): Promise<Interaction | null> => {
  return await getItem(`interactions.${id}`)
}

export const deleteInteraction = async (id: string): Promise<void> => {
  await removeItem(`interactions.${id}`)
}
