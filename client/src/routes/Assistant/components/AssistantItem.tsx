import classnames from 'classnames'
import OpenaiIcon from '../../../components/OpenaiIcon'
import { Assistant } from '../../../service/assistant'

interface IAssistantItemProps {
  className?: string
  assistant: Pick<Assistant, 'name' | 'description' | 'avatar'>
  isActive: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const AssistantItem = ({ assistant, isActive, className, onClick }: IAssistantItemProps) => {
  return (
    <div className={classnames(className, 'flex items-center space-x-4')} onClick={onClick}>
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
        <div className='text-md font-extrabold truncate'>{assistant.name}</div>
        <div className='text-base-content/70 text-xs truncate'>{assistant.description}</div>
      </div>
    </div>
  )
}

export default AssistantItem
