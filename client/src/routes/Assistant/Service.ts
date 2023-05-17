import { v4 as uuidv4 } from 'uuid'
import localforage from 'localforage'

type UUID = string

export const modelConfig = {
  model: 'gpt-3.5-turbo',
  // 上下文数量
  context_size: 5,
  // 使用哪个采样温度，介于0和2之间。较高的值如0.8会使输出更随机，而像0.2这样较低的值会使其更加集中和确定性。
  temperature: 1,
  // 一种与温度采样相对的替代方法称为核心采样，其中模型考虑令牌结果。使用 top_p 概率质量进行采样。因此，0.1 表示仅考虑组成前 10% 概率质量的令牌。
  top_p: 1,
  // 在聊天完成中生成的令牌的最大数量。
  max_tokens: 2000,
  // -2.0 和 2.0 之间的数字。正面的值会根据新标记是否出现在文本中而对其进行惩罚，从而增加模型的可能性。谈论新话题。
  presence_penalty: 0,
  // -2.0 和 2.0 之间的数字。正面的值根据新令牌在到目前为止的文本中的现有频率对其进行惩罚，从而降低模型的可能性。重复相同的台词。
  frequency_penalty: 0
}

// 通用GPT
export const defaultAssistant: Assistant = {
  id: 'chatGpt',
  name: '通用GPT',
  description: '通用ChatGPT助手',
  avatar: '',
  initialMessage: '你好，我是通用GPT助手',
  modelConfig: modelConfig,
  interactionIds: []
}

export const defaultAssistantList: Assistant[] = [
  defaultAssistant,
  {
    id: '1',
    name: 'Bob',
    description: '你好我叫Bob',
    initialMessage: '你好我叫Bob',
    avatar: 'https://api.multiavatar.com/bob.png',
    modelConfig: modelConfig,
    interactionIds: []
  },
  {
    id: '2',
    name: 'jerry',
    description: '你好我叫Jerry',
    initialMessage: '你好我叫Jerry',
    avatar: 'https://api.multiavatar.com/jerry.png',
    modelConfig: modelConfig,
    interactionIds: []
  },
  {
    id: '3',
    name: 'tony',
    description: '你好我叫Tony',
    avatar: 'https://api.multiavatar.com/tony.png',
    modelConfig: modelConfig,
    interactionIds: []
  }
]

export interface Message {
  id: string
  interactionId: string
  text: string
  timestamp: number
}

export interface Interaction {
  id: string
  assistantId: string
  messageIds: string[]
}

export interface Assistant {
  id: UUID
  name: string
  description: string
  avatar: string
  initialMessage?: string
  modelConfig: {
    model: string
    context_size: number
    temperature: number
    top_p: number
    max_tokens: number
    presence_penalty: number
    frequency_penalty: number
  }
  interactionIds: string[]
}

export const initialize = async (): Promise<void> => {
  await localforage.setItem(
    'assistantsIds',
    defaultAssistantList.map(assistant => assistant.id)
  )
  await Promise.all(
    defaultAssistantList.map(assistant => localforage.setItem(`assistants.${assistant.id}`, assistant))
  )
}

export const getAllAssistantsIds = async (): Promise<string[]> => {
  return (await localforage.getItem('assistantsIds')) || []
}

export const getAllAssistants = async (): Promise<Assistant[]> => {
  const assistantsIds = await getAllAssistantsIds()
  const assistants = await Promise.all(assistantsIds.map(id => localforage.getItem(`assistants.${id}`)))
  return assistants.filter((assistant): assistant is Assistant => !!assistant)
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
  await localforage.setItem('assistantsIds', assistants)
  await localforage.setItem(`assistants.${id}`, assistant)
  return assistant
}

export const getAssistant = async (id: string): Promise<Assistant | null> => {
  return await localforage.getItem(`assistants.${id}`)
}

export const deleteAssistant = async (id: string): Promise<void> => {
  await localforage.removeItem(`assistants.${id}`)
}

export const addInteraction = async (assistantId: string, interactionId?: string): Promise<Interaction> => {
  const id = interactionId || uuidv4()
  const interaction: Interaction = {
    id,
    assistantId,
    messageIds: []
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
  const interaction = await localforage.getItem(`interactions.${id}`)
  if (!interaction) {
  }
  return await localforage.getItem(`interactions.${id}`)
}

export const deleteInteraction = async (id: string): Promise<void> => {
  await localforage.removeItem(`interactions.${id}`)
}

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
