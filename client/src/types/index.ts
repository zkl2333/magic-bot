type UUID = string
type Timestamp = number

export enum SESSION_TYPE {
  CHAT = 'chat',
  REVISION = 'revision',
  GENERATOR = 'generator'
}

export interface IMessage {
  id: UUID
  interactionId: IInteraction['id']
  exclude: boolean
  isFinish: boolean
  message: string
  role: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface IInteraction {
  id: UUID
  loading: boolean
  mode?: SESSION_TYPE
  title: string
  messages?: IMessage[]
}
