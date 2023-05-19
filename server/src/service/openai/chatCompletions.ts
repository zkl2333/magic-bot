import { ChatCompletionRequest } from '../../controllers/chatController'
import { Message } from '../../types'
import { OpenAIApi, Configuration } from 'openai'

const createMessage = (chatList: Message[]) => {
  return chatList.map(item => ({ role: item.role, content: item.content }))
}

const baseUrl = 'https://api.aiproxy.io/v1'
const key = 'ap-yKWuh4e031IGGLMrqmGL2C4DrbmZNu79XIkQKn43m3pItxWW'

// const baseUrl = 'https://key-rental-api.bowen.cool/openai'
// const key = 'df73e83d-d0e0-401b-9cd5-965e97c52e5d'

const configuration = new Configuration({
  apiKey: key,
  basePath: baseUrl
})

const openai = new OpenAIApi(configuration)

const chatCompletions = async ({ messages, modelConfig }: ChatCompletionRequest) => {
  console.log('message', messages[messages.length - 1]?.content)
  try {
    const response = await openai.createChatCompletion(
      {
        ...modelConfig,
        stream: true,
        messages: createMessage(messages)
      },
      { responseType: 'stream' }
    )
    return response
  } catch (error: any) {
    if (error.response) {
      return error.response
    }
    throw error
  }
}

export default chatCompletions
