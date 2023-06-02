import { PrismaClient } from '@prisma/client'

const sessionId = 'AIP_MANAGE_KEY'
const prisma = new PrismaClient()

const baseUrl = 'https://aiproxy.io/api'

const api = {
  createApiKey: '/user/createApiKey',
  getPointAccount: '/point/getPointAccount',
  listTransaction: '/point/listTransaction'
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

const printSensitiveLog = (message: string, sensitiveData: string) => {
  const prefix = sensitiveData.slice(0, 7)
  const suffix = sensitiveData.slice(-7)
  console.log(`${message} ${prefix}****${suffix}`)
}

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

export const createApiKey = async (userId: string) => {
  const headers = {
    'content-type': 'application/json',
    cookie: `sessionId=${sessionId}`
  }

  const data = {
    name: `web-user-${userId.slice(0, 7)}`,
    externalId: userId,
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
    console.error('createApiKey error', responseBody)
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
    // throw new Error(`Request failed with status code ${response.status}`)
    console.error(`listApiKey Request failed with status code ${response.status}`)
    return []
  }

  const responseBody = await response.json()

  if (!responseBody.success) {
    console.error('listApiKey error', responseBody)
    // throw new Error(responseBody.message)
    return []
  }

  return responseBody.data
}

export const fetchApiKey = async (userId: string) => {
  // 提取创建 userPlatform 的逻辑到一个函数中
  const createUserPlatformAndLog = async (apiKey: string) => {
    const newUserPlatform = await prisma.userPlatform.create({
      data: {
        platform: 'AI Proxy',
        apiKey: apiKey,
        user: {
          connect: { id: userId }
        }
      }
    })

    printSensitiveLog('AI密钥关联成功', newUserPlatform.apiKey)

    return newUserPlatform.apiKey
  }

  const existingAIKey = await prisma.userPlatform.findFirst({
    where: {
      userId: userId,
      platform: 'AI Proxy'
    }
  })

  if (existingAIKey) {
    return existingAIKey.apiKey
  }

  const allApiKeys = await listApiKey()

  const matchingApiKey = allApiKeys.find((key: any) => key.externalId === userId)

  if (matchingApiKey) {
    printSensitiveLog('找到关联的 AI密钥', matchingApiKey.apiKey)

    // 使用提取的函数
    return createUserPlatformAndLog(matchingApiKey.apiKey)
  }

  const newApiKey = await createApiKey(userId)
  printSensitiveLog('创建AI密钥', newApiKey)

  // 使用提取的函数
  return createUserPlatformAndLog(newApiKey)
}

export const listTransaction = async (uid: string, page: number) => {
  const { subKey } = await getPointAccount(uid)

  const headers = {
    'content-type': 'application/json',
    cookie: `sessionId=${sessionId}`
  }

  const response = await fetch(createUrl(api.listTransaction), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      order: 'desc',
      orderBy: 'gmtCreate',
      page: page,
      pageSize: 10,
      subKey: subKey
    })
  })

  if (!response.ok) {
    throw new Error(`Request failed with status code ${response.status}`)
  }

  const responseBody = await response.json()

  if (!responseBody.success) {
    console.error('listTransaction error', responseBody)
    throw new Error(responseBody.message)
  }

  return responseBody.data
}
