import { Message } from '../types'
import { setItem, getItem, removeItem } from './storage'
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
    text,
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

export const updateMessage = async (id: string, text: string): Promise<void> => {
  const message = await getMessage(id)
  if (message) {
    message.text = text
    message.updatedAt = Date.now()
    return await setItem(`messages.${id}`, message)
  }
}
