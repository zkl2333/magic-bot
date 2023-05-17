import { Message } from '../types'
import { setItem, getItem, removeItem } from './storage'
import { getInteraction } from './interaction'
import { v4 as uuidv4 } from 'uuid'

export const addMessage = async (interactionId: string, text: string): Promise<Message> => {
  const id = uuidv4()
  const message: Message = {
    id,
    interactionId,
    text,
    timestamp: Date.now()
  }
  const interaction = await getInteraction(interactionId)
  if (interaction) {
    interaction.messageIds.push(id)
    await setItem(`interactions.${interactionId}`, interaction)
    await setItem(`messages.${id}`, message)
  }

  return message
}

export const getMessage = async (id: string): Promise<Message | null> => {
  return await getItem(`messages.${id}`)
}

export const deleteMessage = async (id: string): Promise<void> => {
  await removeItem(`messages.${id}`)
}
