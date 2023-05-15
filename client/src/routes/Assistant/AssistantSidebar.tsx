import classNames from 'classnames'
import { IAssistant } from '../../types'
import AssistantItem from './AssistantItem'
import { NavLink } from 'react-router-dom'
import { defaultAssistant } from '../../constence'

const AssistantSidebar = ({ assistantList }: { assistantList: IAssistant[] }) => {
  return (
    <div className='overflow-hidden h-full text-base-content border-base-300 border-r bg-base-200'>
      <div className='h-full flex justify-between safe-area'>
        <div className='flex-1 overflow-y-auto'>
          <NavLink
            to={'chatGpt'}
            className={({ isActive, isPending }) =>
              classNames('px-4 py-3 block', {
                'opacity-20': isPending,
                'bg-base-300': isActive
              })
            }
          >
            {({ isActive }) => <AssistantItem isActive={isActive} assistant={defaultAssistant} />}
          </NavLink>
          {assistantList.map(assistant => (
            <NavLink
              to={assistant.id}
              className={({ isActive, isPending }) =>
                classNames('px-4 py-3 block', {
                  'opacity-20': isPending,
                  'bg-base-300': isActive
                })
              }
            >
              {({ isActive }) => (
                <AssistantItem isActive={isActive} key={assistant.id} assistant={assistant} />
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AssistantSidebar
