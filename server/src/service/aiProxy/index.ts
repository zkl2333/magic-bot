import { PrismaClient } from '@prisma/client'

const sessionId = 'MTM5NWQzZGQtMTk3ZC00MjEwLWI3ZjYtNzU0NjFhZmVlZWY3'
const prisma = new PrismaClient()

const baseUrl = 'https://aiproxy.io/api'

const api = {
  createApiKey: '/user/createApiKey',
  getPointAccount: '/point/getPointAccount'
}

const defaultModelPermission = [
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

const createUrl = (path: string) => {
  return `${baseUrl}${path}`
}

export const getPointAccount = async (uid: string) => {
  const headers = {
    'content-type': 'application/json',
    cookie: `sessionId=${sessionId}`
  }

  const response = await fetch(createUrl(`${api.getPointAccount}?externalId=${uid}`), {
    method: 'GET',
    headers
  })

  if (!response.ok) {
    throw new Error(`Request failed with status code ${response.status}`)
  }

  const responseBody = await response.json()

  if (responseBody.success) {
    return responseBody.data
  } else {
    console.error(responseBody)
    return null
  }
}

export const createApiKey = async (uid: string) => {
  const headers = {
    'content-type': 'application/json',
    cookie: `sessionId=${sessionId}`
  }

  const data = {
    name: `web-user-${uid.slice(0, 8)}`,
    externalId: uid,
    enableSubPointAccount: true,
    initPoint: '1000.00',
    modelPermission: defaultModelPermission
  }

  const response = await fetch(createUrl(api.createApiKey), {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error(`Request failed with status code ${response.status}`)
  }

  const responseBody = await response.json()

  if (!responseBody.success) {
    console.error(responseBody)
    throw new Error(responseBody.message)
  }

  return responseBody.data
}

export const listApiKey = async () => {
  const headers = {
    'content-type': 'application/json',
    cookie: `sessionId=${sessionId}`
  }

  const response = await fetch(createUrl('/user/listApiKey'), {
    method: 'GET',
    headers
  })

  if (!response.ok) {
    throw new Error(`Request failed with status code ${response.status}`)
  }

  const responseBody = await response.json()

  if (!responseBody.success) {
    console.error(responseBody)
    throw new Error(responseBody.message)
  }

  return responseBody.data
}

export const getApiKey = async (uid: string) => {
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
  console.log('创建AI密钥', apiKey.slice(0, 8))

  const createdUserPlatform = await prisma.userPlatform.create({
    data: {
      platform: 'AI Proxy',
      apiKey: apiKey,
      user: {
        connect: { id: uid }
      }
    }
  })

  console.log('AI密钥关联成功', createdUserPlatform.apiKey.slice(0, 8))

  return createdUserPlatform.apiKey
}
