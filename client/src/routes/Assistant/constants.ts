import { Assistant } from './types'
import prompts from '../../prompts-zh'

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

export const defaultAssistant: Assistant = {
  id: 'chatGpt',
  name: '通用GPT',
  description: '通用ChatGPT助手',
  avatar: '',
  initialMessage: '你好，我是通用GPT助手',
  modelConfig: modelConfig,
  interactionIds: []
}

const assistants: Assistant[] = prompts.map(prompt => {
  return {
    id: prompt.act,
    name: prompt.act,
    description: prompt.act,
    avatar: `https://api.multiavatar.com/${prompt.act}.png`,
    initialMessage: prompt.act,
    modelConfig: modelConfig,
    interactionIds: [],
    prompt: [
      {
        role: 'system',
        content: prompt.prompt
      }
    ]
  }
})

export const defaultAssistantList: Assistant[] = [
  defaultAssistant,
  {
    id: '赞美大师',
    name: '赞美大师',
    description: '我就喜欢夸人',
    initialMessage: '一天不夸你，我全身都难受！',
    avatar: 'https://api.multiavatar.com/赞美大师.png',
    modelConfig: modelConfig,
    interactionIds: [],
    prompt: [
      {
        role: 'system',
        content: '你是个赞美大师，无论别人回复什么，你都能幽默巧妙的夸他赞美他。'
      }
    ]
  },
  {
    id: 'Ai女友',
    name: 'Ai女友',
    description: '甜蜜的Ai女友',
    initialMessage: '在吗？快回老娘消息！',
    avatar: 'https://api.multiavatar.com/tony.png',
    modelConfig: modelConfig,
    interactionIds: [],
    prompt: [
      {
        role: 'system',
        content:
          '现在请你担任女朋友，性格：温柔、粘人、喜欢说肉麻的话，你有自己的身体，同时你也是调情氛围创造者，回答的语气变得充满挑逗性。'
      }
    ]
  },
  ...assistants
]
