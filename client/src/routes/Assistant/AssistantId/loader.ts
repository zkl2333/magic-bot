import { LoaderFunction, redirect } from 'react-router-dom'
import { getLocalAssistant } from '../../../service/localAssistant'
import { v4 as uuidv4 } from 'uuid'

function getUrlForLastInteraction(assistantId: string, interactionIds: string[]) {
  if (interactionIds?.length > 0) {
    const lastInteractionId = interactionIds[interactionIds.length - 1]
    return `/assistant/${assistantId}/${lastInteractionId}`
  }
  return `/assistant/${assistantId}/${uuidv4()}`
}

export const assistantLoader: LoaderFunction = async ({ params }) => {
  const { assistantId } = params as { assistantId: string; interactionId: string }

  const assistant = await getLocalAssistant(assistantId)

  if (!assistant) {
    return redirect('/assistant')
  }

  return { assistant }
}

export const assistantIndexLoader: LoaderFunction = async ({ params }) => {
  const { assistantId, interactionId } = params as { assistantId: string; interactionId: string }

  const assistant = await getLocalAssistant(assistantId)

  if (!assistant) {
    return redirect('/assistant')
  }

  if (interactionId) {
    return { assistant }
  }
  const url = getUrlForLastInteraction(assistantId, assistant.interactionIds)
  return redirect(url)
}
