import { ChatListItem } from '../../types'

const createMessage = (chatList: ChatListItem[]) => {
  return chatList.map(item => ({ role: item.role, content: item.message }))
}

async function completions(chatList: ChatListItem[]) {
  // fetch 在 Nodejs 18 里已经可用
  const response = await fetch(`http://api.aiproxy.io/v1/chat/completions`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ap-iVtcld0cTkOSiA8ke2iea4DFEFCK1jLfFXbUqLuSYsph4Zn6`
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
