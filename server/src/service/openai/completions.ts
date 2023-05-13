import { ChatListItem } from '../../types'
import { OpenAIApi, Configuration } from 'openai'

const createMessage = (chatList: ChatListItem[]) => {
  return chatList.map(item => ({ role: item.role, content: item.message }))
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

const completions = async (chatList: ChatListItem[]) => {
  console.log('message', chatList[chatList.length - 1]?.message)
  try {
    const response = await openai.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: createMessage(chatList)
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

export default completions
