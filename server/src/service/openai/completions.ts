async function completions() {
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
      messages: [{ role: 'user', content: '你好' }]
    })
  })

  return response
}

export default completions
