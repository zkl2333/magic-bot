import { LoaderFunction, redirect } from 'react-router-dom'
import { getAllAssistants } from './service/assistant'

export const assistantLayoutLoader: LoaderFunction = async ({ params }) => {
  const { assistantId } = params

  const assistantList = await getAllAssistants()

  if (!assistantId && assistantList.length > 0) {
    const assistant = assistantList[0]
    return redirect(`/assistant/${assistant.id}`)
  }

  return {
    assistantList
  }
}
