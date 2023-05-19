import { LoaderFunction } from "react-router-dom"
import { getAllAssistants } from "../service/assistant"

export const assistantLayoutLoader: LoaderFunction = async () => {
  const assistantList = await getAllAssistants()

  return {
    assistantList
  }
}
