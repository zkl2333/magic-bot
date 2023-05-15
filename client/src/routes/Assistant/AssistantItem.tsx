import classnames from 'classnames'
import { IAssistant } from '../../types'
import OpenaiIcon from '../../components/OpenaiIcon'

interface IAssistantItemProps {
  assistant: IAssistant
  isActive: boolean
}

const AssistantItem = ({ assistant, isActive }: IAssistantItemProps) => {
  return (
    <div className='flex w-48 items-center space-x-4'>
      <div
        className={classnames('shrink-0 avatar w-10 h-10 rounded-full overflow-hidden', {
          'ring ring-primary': isActive
        })}
      >
        {assistant.avatar ? (
          <img src={assistant.avatar} />
        ) : (
          <OpenaiIcon
            style={{
              backgroundColor: 'rgb(16, 163, 127)'
            }}
            className='p-1.5 text-[#fff]'
          />
        )}
      </div>
      <div className='overflow-hidden'>
        <div className='text-md font-extrabold'>{assistant.name}</div>
        <div className='text-base-content/70 text-xs truncate'>{assistant.description}</div>
      </div>
    </div>
  )
}

export default AssistantItem
