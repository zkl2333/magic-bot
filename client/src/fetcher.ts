import userStore from "./store/UserStore"

export const fetcher = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${userStore.token}`,
      ...options?.headers
    }
  })
  return res.json()
}
