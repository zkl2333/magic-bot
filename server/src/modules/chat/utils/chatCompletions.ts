import { OpenAIApi, Configuration } from 'openai'

const createMessage = (chatList: any[]) => {
  return chatList.map(item => ({ role: item.role, content: item.content }))
}

const baseUrl = 'https://api.aiproxy.io/v1'

const chatCompletions = async ({ messages, config }: any, apiKey: string) => {
  const configuration = new Configuration({
    basePath: baseUrl,
    apiKey: apiKey
  })
  const openai = new OpenAIApi(configuration)

  console.log('message', messages[messages.length - 1]?.content)
  try {
    const response = await openai.createChatCompletion(
      {
        ...config,
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
