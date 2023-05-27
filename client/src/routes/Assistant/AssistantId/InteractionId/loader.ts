import { LoaderFunction } from 'react-router-dom'
import { getInteraction, addInteraction } from '../../../../service/interaction'

export const assistantInteractionLoader: LoaderFunction = async ({ params }) => {
  const { assistantId, interactionId } = params as { assistantId: string; interactionId: string }

  const actualInteractionId = interactionId
  const interaction =
    (await getInteraction(actualInteractionId)) || (await addInteraction(assistantId, actualInteractionId))

  return {
    interaction
  }
}
