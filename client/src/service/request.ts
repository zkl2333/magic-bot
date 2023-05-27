interface IRequestOptions extends RequestInit {
  query?: { [key: string]: any }
}

const request = async (url: string, options: IRequestOptions = { method: 'GET' }): Promise<any> => {
  if (options.query) {
    const queryStr = new URLSearchParams(options.query).toString()
    url += `?${queryStr}`
  }
  const response = await fetch(url, options)
  try {
    return response.json()
  } catch (error) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`)
  }
}

export default request
