import { redirect, ActionFunction } from 'react-router-dom'
import { addAssistant } from './Assistant/service/assistant'

export const AssistantLayoutAction: ActionFunction = async ({ request }) => {
  let formData = await request.formData()
  try {
    const assistant = JSON.parse(formData.get('assistant') as string)
    await addAssistant(assistant)
    return redirect(`/assistant/${assistant.id}`)
  } catch (error) {
    console.log(error)
  }
  return null
}
