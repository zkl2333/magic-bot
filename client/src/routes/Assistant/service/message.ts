import localforage from 'localforage'
import { Message } from '../types'
import { getInteraction } from './interaction'
import { v4 as uuidv4 } from 'uuid'

export const addMessage = async (
  interactionId: string,
  role: Message['role'],
  text: string
): Promise<Message> => {
  const id = uuidv4()
  const message: Message = {
    id,
    interactionId,
    content: text,
    role,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
  const interaction = await getInteraction(interactionId)
  if (interaction) {
    if (!interaction.title || interaction.title === '') {
      interaction.title = text
    }
    interaction.messageIds.push(id)
    await localforage.setItem(`interactions.${interactionId}`, interaction)
    await localforage.setItem(`messages.${id}`, message)
  }

  return message
}

export const getMessage = async (id: string): Promise<Message | null> => {
  return await localforage.getItem(`messages.${id}`)
}

export const deleteMessage = async (id: string): Promise<void> => {
  await localforage.removeItem(`messages.${id}`)
}

export const updateMessage = async (id: string, text: string): Promise<Message | null> => {
  const message = await getMessage(id)
  if (message) {
    message.content = text
    message.updatedAt = Date.now()
    return await localforage.setItem(`messages.${id}`, message)
  }
  return null
}
