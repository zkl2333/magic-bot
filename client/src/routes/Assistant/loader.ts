import { LoaderFunction, redirect } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { getAllAssistants, getAssistant } from './service/assistant'
import { getInteraction, addInteraction } from './service/interaction'

export const assistantLoader: LoaderFunction = async () => {
  const assistantList = await getAllAssistants()

  return {
    assistantList
  }
}

export const assistantInteractionLoader: LoaderFunction = async ({ params }) => {
  const { assistantId, interactionId } = params

  if (!assistantId) {
    return redirect(`/assistant/new`)
  }

  const assistant = await getAssistant(assistantId)

  if (!assistant) {
    return redirect(`/assistant/new`)
  }

  if (!interactionId) {
    if (assistant && assistant.interactionIds.length > 0) {
      return redirect(
        `/assistant/${assistantId}/${assistant.interactionIds[assistant.interactionIds.length - 1]}`
      )
    }
    return redirect(`/assistant/${assistantId}/${uuidv4()}`)
  }

  const interaction = await getInteraction(interactionId)

  if (!interaction) {
    const interaction = await addInteraction(assistantId, interactionId)
    const assistant = await getAssistant(assistantId)
    return {
      assistant,
      interaction
    }
  }

  return {
    assistant,
    interaction
  }
}
