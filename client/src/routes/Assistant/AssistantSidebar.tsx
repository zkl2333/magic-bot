import { IAssistant } from '../../types'
import AssistantItem from './AssistantItem'

const AssistantSidebar = ({ assistantList }: { assistantList: IAssistant[] }) => {
  return (
    <div className='overflow-hidden h-full w-60 text-base-content border-base-300 border-r bg-base-200'>
      <div className='h-full flex flex-col justify-between safe-area'>
        <div className='p-4 flex-1 overflow-y-auto'>
          {assistantList.map(assistant => (
            <AssistantItem key={assistant.id} assistant={assistant} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AssistantSidebar
