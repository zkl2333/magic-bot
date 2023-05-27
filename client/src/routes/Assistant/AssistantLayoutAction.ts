import { redirect, ActionFunction } from 'react-router-dom'
import { addLocalAssistant, deleteLocalAssistant } from '../../service/localAssistant'
import { creatAssistant, deleteAssistant } from '../../service/assistant'

export const assistantLayoutAction: ActionFunction = async ({ request }) => {
  try {
    let formData = await request.formData()
    switch (request.method) {
      case 'DELETE':
        const assistantId = formData.get('assistantId') as string
        const redirectTo = formData.get('redirectTo') as string
        if (assistantId) {
          await deleteLocalAssistant(assistantId)
          await deleteAssistant(assistantId)
        }
        return redirect(redirectTo)
      case 'POST':
        const assistant = JSON.parse(formData.get('assistant') as string)
        const newAssistant = await creatAssistant({ ...assistant, isPublic: false })
        await addLocalAssistant({
          id: newAssistant.id,
          interactionIds: []
        })
        return redirect(`/assistant/${newAssistant.id}`)
    }
  } catch (error) {
    console.error(error)
  }
  return null
}
