import { PrismaClient } from '@prisma/client'

const sessionId = 'MTM5NWQzZGQtMTk3ZC00MjEwLWI3ZjYtNzU0NjFhZmVlZWY3'
const prisma = new PrismaClient()

export const createApiKey = async (uid: number) => {
  const url = 'https://aiproxy.io/api/user/createApiKey'

  const headers = {
    'content-type': 'application/json',
    cookie: `sessionId=${sessionId}`
  }

  const data = {
    name: `web-user-${uid}`,
    enableSubPointAccount: true,
    initPoint: '1000.00',
    modelPermission: [
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-0301',
      'gpt-4',
      'gpt-4-0314',
      'gpt-4-32k',
      'gpt-4-32k-0314',
      'text-davinci-003',
      'text-davinci-002',
      'text-curie-001',
      'text-babbage-001',
      'text-ada-001',
      'text-embedding-ada-002',
      'text-search-ada-doc-001',
      'whisper-1',
      'text-davinci-edit-001',
      'code-davinci-edit-001'
    ]
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error(`Request failed with status code ${response.status}`)
  }

  const responseBody = await response.json()
  console.log(responseBody)
  return responseBody.data
}

export const getApiKey = async (uid: number) => {
  // 判断是否存在AI密钥
  const existingUserPlatform = await prisma.userPlatform.findFirst({
    where: {
      userId: uid,
      platform: 'AI Proxy'
    }
  })

  if (existingUserPlatform) {
    return existingUserPlatform.apiKey
  }

  const apiKey = await createApiKey(uid)

  const createdUserPlatform = await prisma.userPlatform.create({
    data: {
      platform: 'AI Proxy',
      apiKey: apiKey,
      user: {
        connect: { id: uid }
      }
    }
  })

  return createdUserPlatform.apiKey
}
