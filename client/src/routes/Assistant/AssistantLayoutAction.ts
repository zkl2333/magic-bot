import { redirect, ActionFunction } from 'react-router-dom'
import { addAssistant, deleteAssistant } from './service/assistant'

export const assistantLayoutAction: ActionFunction = async ({ request }) => {
  console.log('assistantLayoutAction', request)
  try {
    let formData = await request.formData()
    switch (request.method) {
      case 'DELETE':
        const assistantId = formData.get('assistantId') as string
        if (assistantId) {
          await deleteAssistant(assistantId)
        }
        return null
      case 'POST':
        const assistant = JSON.parse(formData.get('assistant') as string)
        await addAssistant(assistant)
        return redirect(`/assistant/${assistant.id}`)
    }
  } catch (error) {
    console.log(error)
  }
  return null
}
