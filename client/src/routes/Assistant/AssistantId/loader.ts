import { LoaderFunction, redirect } from 'react-router-dom'
import { getAssistant } from '../service/assistant'
import { v4 as uuidv4 } from 'uuid'

function redirectTo(url: string) {
  return redirect(url)
}

function getUrlForNewAssistant() {
  return '/assistant/new'
}

function getUrlForLastInteraction(assistantId: string, interactionIds: string[]) {
  if (interactionIds.length > 0) {
    const lastInteractionId = interactionIds[interactionIds.length - 1]
    return `/assistant/${assistantId}/${lastInteractionId}`
  }
  return `/assistant/${assistantId}/${uuidv4()}`
}

export const assistantLoader: LoaderFunction = async ({ params }) => {
  const { assistantId, interactionId } = params

  if (!assistantId) {
    return redirectTo(getUrlForNewAssistant())
  }

  const assistant = await getAssistant(assistantId)

  if (!assistant) {
    return redirectTo(getUrlForNewAssistant())
  }

  if (interactionId) {
    return { assistant }
  }

  const url = getUrlForLastInteraction(assistantId, assistant.interactionIds)
  return redirectTo(url)
}
