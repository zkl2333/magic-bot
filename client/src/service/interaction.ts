import localforage from 'localforage'
import { createId } from '@paralleldrive/cuid2'
import { deleteMessage } from './message'
import { Interaction } from '../routes/Assistant/types'
import { getLocalAssistant } from './localAssistant'

export const addInteraction = async (assistantId: string, interactionId?: string): Promise<Interaction> => {
  const id = interactionId || createId()
  const interaction: Interaction = {
    id,
    title: '',
    assistantId,
    messageIds: [],
    createdAt: Date.now()
  }

  const assistant = await getLocalAssistant(assistantId)
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
  const assistant = await getLocalAssistant(interaction.assistantId)
  if (!assistant) {
    return
  }
  assistant.interactionIds = assistant.interactionIds.filter(interactionId => interactionId !== id)
  await localforage.setItem(`assistants.${assistant.id}`, assistant)
}
