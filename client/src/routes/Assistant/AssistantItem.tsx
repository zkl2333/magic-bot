import { IAssistant } from '../../types'

const AssistantItem = ({ assistant }: { assistant: IAssistant }) => {
  return <div>{JSON.stringify(assistant, null, 2)}</div>
}

export default AssistantItem
