import localforage from 'localforage'
import { defaultAssistantList } from '../../constence'
import interactionStore from '../../store/InteractionStore'
import { IAssistant } from '../../types'
import { getAllItems } from '../../utils'

async function assistantLoader() {
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

export default assistantLoader
