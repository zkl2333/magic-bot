import localforage from 'localforage'

export const getItem = async (key: string): Promise<any> => {
  return await localforage.getItem(key)
}

export const setItem = async (key: string, value: any): Promise<void> => {
  await localforage.setItem(key, value)
}

export const removeItem = async (key: string): Promise<void> => {
  await localforage.removeItem(key)
}
