import { LoaderFunction } from 'react-router-dom'
import { getPublicAssistants } from '../../../service/assistant'

const assistantNewLoader: LoaderFunction = async () => {
  const assistants = await getPublicAssistants()
  return {
    assistants
  }
}

export default assistantNewLoader
