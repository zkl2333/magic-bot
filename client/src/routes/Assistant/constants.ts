import { Assistant } from './types'

export const modelConfig = {
  model: 'gpt-3.5-turbo',
  context_size: 5,
  temperature: 1,
  top_p: 1,
  max_tokens: 2000,
  presence_penalty: 0,
  frequency_penalty: 0
}

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
