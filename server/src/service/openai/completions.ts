import { ChatListItem } from '../../types'

const createMessage = (chatList: ChatListItem[]) => {
  return chatList.map(item => ({ role: item.role, content: item.message }))
}

async function completions(chatList: ChatListItem[]) {
  // fetch 在 Nodejs 18 里已经可用
  const response = await fetch(`https://key-rental-api.bowen.cool/openai/v1/chat/completions`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer df73e83d-d0e0-401b-9cd5-965e97c52e5d`
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
