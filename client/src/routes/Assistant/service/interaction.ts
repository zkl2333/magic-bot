import localforage from 'localforage'
import { Interaction } from '../types'
import { getAssistant } from './assistant'
import { v4 as uuidv4 } from 'uuid'
import { deleteMessage } from './message'

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
    await localforage.setItem(`assistants.${assistantId}`, assistant)
    await localforage.setItem(`interactions.${id}`, interaction)
  }

  return interaction
}

export const getInteraction = async (id: string): Promise<Interaction | null> => {
  return await localforage.getItem(`interactions.${id}`)
}

export const deleteInteraction = async (id: string): Promise<void> => {
  const interaction = await getInteraction(id)
  if (!interaction) {
    return
  }
  localforage.removeItem(`interactions.${id}`)
  await Promise.all(interaction.messageIds.map(messageId => deleteMessage(messageId)))
  const assistant = await getAssistant(interaction.assistantId)
  if (!assistant) {
    return
  }
  assistant.interactionIds = assistant.interactionIds.filter(interactionId => interactionId !== id)
  await localforage.setItem(`assistants.${assistant.id}`, assistant)
}
