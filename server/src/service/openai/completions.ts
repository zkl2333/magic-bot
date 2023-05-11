import { ChatListItem } from '../../types'

const createMessage = (chatList: ChatListItem[]) => {
  return chatList.map(item => ({ role: item.role, content: item.message }))
}

// const baseUrl = 'https://api.aiproxy.io'
// const key = 'ap-yKWuh4e031IGGLMrqmGL2C4DrbmZNu79XIkQKn43m3pItxWW'
const baseUrl = 'https://key-rental-api.bowen.cool/openai'
const key = 'df73e83d-d0e0-401b-9cd5-965e97c52e5d'

async function completions(chatList: ChatListItem[]) {
  // fetch 在 Nodejs 18 里已经可用
  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`
    },
    method: 'POST',
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: createMessage(chatList)
    })
  })

  return response
}

export default completions
