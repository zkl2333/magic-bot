export const fetcher = async (url: string, options?: RequestInit) => {
  const token = localStorage.getItem('token')
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options?.headers
    }
  })
  return res.json()
}
