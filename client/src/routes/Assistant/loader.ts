import localforage from 'localforage'
import { defaultAssistant, defaultAssistantList } from '../../constence'
import interactionStore from '../../store/InteractionStore'
import { IAssistant } from '../../types'
import { getAllItems } from '../../utils'
import { LoaderFunction } from 'react-router-dom'

export const assistantLoader: LoaderFunction = async () => {
  const store = localforage.createInstance({
    name: 'assistant'
  })

  const length = await store.length()

  if (length === 0) {
    await Promise.all(
      defaultAssistantList.map(assistant =>
        store.setItem(assistant.id, { ...assistant, createdAt: Date.now(), updatedAt: Date.now() })
      )
    )
    return {
      assistantList: defaultAssistantList,
      interactions: interactionStore.interactions
    }
  }

  const assistantList = await getAllItems<IAssistant>(store)

  return {
    assistantList,
    interactions: interactionStore.interactions
  }
}

export const assistantInteractionLoader: LoaderFunction = async ({ params }) => {
  console.log(params)
  const { assistantId, interactionId } = params

  const assistantStore = localforage.createInstance({
    name: 'assistant'
  })

  const interactionStore = localforage.createInstance({
    name: `interaction`
  })

  const getAssistant = async (assistantId: string) => {
    if (assistantId === 'chatGpt') {
      return defaultAssistant
    }
    const assistant = await assistantStore.getItem<IAssistant>(assistantId)
    return assistant
  }

  const [assistant, interaction] = await Promise.all([
    assistantId ? getAssistant(assistantId) : null,
    interactionId ? interactionStore.getItem(`assistant-${assistantId}-interaction-${interactionId}`) : null
  ])

  return {
    assistant,
    interaction
  }
}
