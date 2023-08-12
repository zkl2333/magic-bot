import requestHandler from './request'

export const getIsSystemReady = async () => {
  const data = await requestHandler(`/api/system/isSystemReady`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!data.success) {
    throw new Error(data.message)
  }
  return data.data
}

export const initSystem = async () => {
  return fetch('/api/system/initSystem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getConfig = async () => {
  const data = await requestHandler(`/api/system/getConfig`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  return data.data
}

export const getPublicConfig = async () => {
  const data = await requestHandler(`/api/system/publicConfig`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!data.success) {
    throw new Error(data.message)
  }
  return data.data
}

export const updateConfig = async (data: any) => {
  return requestHandler(`/api/system/updateConfig`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  })
}