import { LoaderFunction } from 'react-router-dom'
import { getAssistants } from '../../service/assistant'

export const assistantLayoutLoader: LoaderFunction = async () => {
  const assistantList = await getAssistants()
  return {
    assistantList
  }
}
