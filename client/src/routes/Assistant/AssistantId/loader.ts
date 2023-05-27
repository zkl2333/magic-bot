import { LoaderFunction, redirect } from 'react-router-dom'
import { addLocalAssistant, deleteLocalAssistant, getLocalAssistant } from '../../../service/localAssistant'
import { v4 as uuidv4 } from 'uuid'
import { getAssistant } from '../../../service/assistant'

export function getUrlForLastInteraction(assistantId: string, interactionIds: string[]) {
  if (interactionIds?.length > 0) {
    const lastInteractionId = interactionIds[interactionIds.length - 1]
    return `/assistant/${assistantId}/${lastInteractionId}`
  }
  return `/assistant/${assistantId}/${uuidv4()}`
}

export const assistantIdLoader: LoaderFunction = async ({ params }) => {
  const { assistantId } = params as { assistantId: string; interactionId: string }

  const assistant = await getAssistant(assistantId)
  const localAssistant = await getLocalAssistant(assistantId)

  if (!assistant) {
    await deleteLocalAssistant(assistantId)
    return redirect('/assistant/new')
  }

  if (!localAssistant) {
    await addLocalAssistant({
      id: assistant.id,
      interactionIds: []
    })
    return null
  }

  return {
    assistant: {
      ...assistant,
      ...localAssistant
    }
  }
}
