import { makeAutoObservable, autorun } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import { MessageItem, Interaction } from '../types'

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
    localStorage.setItem(
      InteractionsKey,
      JSON.stringify(
        this.interactions.map(interaction => {
          const { loading, ...rest } = interaction
          return rest
        })
      )
    )
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

  createOrUpdateInteraction(interactionItem?: Omit<Interaction, 'id'>): string
  createOrUpdateInteraction(interactionItem: Pick<Interaction, 'id'> | Partial<Interaction>): string
  createOrUpdateInteraction(interactionItem: Interaction | Partial<Interaction> = {}) {
    const { id = uuidv4(), ...rest } = interactionItem
    const interactionIndex = this.interactions.findIndex(interaction => interaction.id === id)
    const interactionExists = interactionIndex !== -1

    if (interactionExists) {
      const updatedInteraction = { ...this.interactions[interactionIndex], ...rest }
      this.interactions[interactionIndex] = updatedInteraction
    } else {
      const defaultInteraction = { id, title: '', loading: false }
      this.interactions.push({ ...defaultInteraction, ...rest })
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

  createOrUpdateMessage(messageItem: Omit<MessageItem, 'id'>): string
  createOrUpdateMessage(messageItem: Pick<MessageItem, 'id'> | Partial<MessageItem>): string
  createOrUpdateMessage(messageItem: MessageItem | Partial<MessageItem>) {
    const { id = uuidv4(), ...rest } = messageItem
    const messageItemIndex = this.messages.findIndex(m => m.id === id)
    const messageItemExists = messageItemIndex !== -1

    if (messageItemExists) {
      const updatedMessageItem = { ...this.messages[messageItemIndex], ...rest }
      this.messages[messageItemIndex] = { ...updatedMessageItem, updatedAt: Date.now() }
    } else {
      const defaultMessageItem = {
        id,
        interactionId: this.currentInteractionId,
        isFinish: true,
        exclude: false,
        message: '',
        role: 'user',
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      this.messages.push({ ...defaultMessageItem, ...rest })
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
