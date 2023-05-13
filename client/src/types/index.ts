type UUID = string
type Timestamp = number

export enum SESSION_TYPE {
  CHAT = 'chat',
  REVISION = 'revision',
  GENERATOR = 'generator'
}

export type MessageItem = {
  id: UUID
  interactionId: Interaction['id']
  exclude: boolean
  isFinish: boolean
  message: string
  role: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Interaction {
  loading: boolean
  id: UUID
  mode?: string
  title: string
}
