import { makeAutoObservable, autorun } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import { MessageItem, SESSION_TYPE, Interaction } from '../types'

const InteractionsKey = 'Interactions'
const MessagesKey = 'Messages'

class InteractionStore {
  interactions: Interaction[] = []
  messages: MessageItem[] = []
  currentInteractionId = ''

  constructor() {
    makeAutoObservable(this)
    this._initFromLocalStorage()
    this._initCurrentInteraction()

    autorun(() => {
      this._saveInteractionsToLocalStorage()
    })
  }

  private _initFromLocalStorage() {
    const Interactions = localStorage.getItem(InteractionsKey)
    const messages = localStorage.getItem(MessagesKey)
    if (Interactions) {
      try {
        this.interactions = JSON.parse(Interactions || '[]')
        this.messages = JSON.parse(messages || '[]')
      } catch (error) {}
    }
  }

  private _saveInteractionsToLocalStorage() {
    localStorage.setItem(InteractionsKey, JSON.stringify(this.interactions))
    localStorage.setItem(MessagesKey, JSON.stringify(this.messages))
  }

  private _initCurrentInteraction() {
    const interaction = this.interactions[0]
    if (interaction) {
      this.currentInteractionId = interaction.id
    } else {
      this.messages = []
      this.currentInteractionId = this.createOrUpdateInteraction()
    }
  }

  createOrUpdateInteraction({
    id = uuidv4(),
    title = '',
    type = SESSION_TYPE.CHAT
  }: Partial<Interaction> = {}) {
    const interaction = this.interactions.find(interaction => interaction.id === id)
    if (interaction) {
      interaction.title = title
      interaction.type = type
    } else {
      this.interactions.push({ id, title, type, loading: false })
      this.createOrUpdateMessage({
        interactionId: id,
        message: '你好，有什么可以帮到你的吗？',
        role: 'assistant',
        exclude: true
      })
    }
    this.setCurrentInteractionId(id)
    return id
  }

  deleteInteraction(id: string) {
    this.interactions = this.interactions.filter(interaction => interaction.id !== id)
    this.messages = this.messages.filter(message => message.interactionId !== id)
    if (this.interactions.length === 0) {
      this._initCurrentInteraction()
    } else if (this.currentInteractionId === id) {
      this.setCurrentInteractionId(this.interactions[0].id)
    }
  }

  setCurrentInteractionId(id: string) {
    this.currentInteractionId = id
  }

  get currentInteraction() {
    return this.interactions.find(interaction => interaction.id === this.currentInteractionId)
  }

  get currentInteractionMessages() {
    return this.messages.filter(message => message.interactionId === this.currentInteractionId)
  }

  get currentInteractionIncludeMessages() {
    return this.currentInteractionMessages.filter(message => !message.exclude)
  }

  createOrUpdateMessage({
    id = uuidv4(),
    interactionId = this.currentInteractionId,
    exclude = false,
    message = '',
    role = 'user'
  }: Partial<MessageItem>) {
    const messageItem = this.messages.find(message => message.id === id)
    if (messageItem) {
      messageItem.message = message
      messageItem.exclude = exclude
      messageItem.role = role
      messageItem.updatedAt = Date.now()
    } else {
      this.messages.push({
        id,
        interactionId,
        exclude,
        message,
        role,
        createdAt: Date.now(),
        updatedAt: Date.now()
      })
    }
    return id
  }

  deleteMessage(id: string) {
    this.messages = this.messages.filter(message => message.id !== id)
  }

  setInteractionLoading(id: string, loading: boolean) {
    const interaction = this.interactions.find(interaction => interaction.id === id)
    if (interaction) {
      interaction.loading = loading
    }
  }
}

const interactionStore = new InteractionStore()
export default interactionStore
