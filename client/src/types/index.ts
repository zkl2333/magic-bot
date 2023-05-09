type UUID = string
type Timestamp = number

export enum SESSION_TYPE {
  CHAT = 'chat'
}

export type MessageItem = {
  id: UUID
  interactionId: Interaction['id']
  exclude?: boolean
  message: string
  role: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Interaction {
  id: UUID
  type: string
  title: string
}
