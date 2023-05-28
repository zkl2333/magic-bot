import { LoaderFunction, redirect } from 'react-router-dom'
import { addLocalAssistant, deleteLocalAssistant, getLocalAssistant } from '../../../service/localAssistant'
import { getAssistant } from '../../../service/assistant'
import { createId } from '@paralleldrive/cuid2'

export function getUrlForLastInteraction(assistantId: string, interactionIds: string[]) {
  if (interactionIds?.length > 0) {
    const lastInteractionId = interactionIds[interactionIds.length - 1]
    return `/assistant/${assistantId}/${lastInteractionId}`
  }
  return `/assistant/${assistantId}/${createId()}`
}

export const assistantIdLoader: LoaderFunction = async ({ params }) => {
  const { assistantId } = params as { assistantId: string; interactionId: string }

  const assistant = await getAssistant(+assistantId)
  const localAssistant = await getLocalAssistant(+assistantId)

  if (!assistant) {
    await deleteLocalAssistant(+assistantId)
    return redirect('/assistant/new')
  }

  if (!localAssistant) {
    const newLocalAssistant = await addLocalAssistant({
      id: assistant.id,
      interactionIds: []
    })
    return {
      assistant: {
        ...assistant,
        ...newLocalAssistant
      }
    }
  }

  return {
    assistant: {
      ...assistant,
      ...localAssistant
    }
  }
}
