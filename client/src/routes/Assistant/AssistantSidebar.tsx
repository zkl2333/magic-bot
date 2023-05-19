import classNames from 'classnames'
import { IAssistant } from '../../types'
import AssistantItem from './components/AssistantItem'
import { NavLink } from 'react-router-dom'

const AssistantSidebar = ({ assistantList }: { assistantList: IAssistant[] }) => {
  return (
    <div className='overflow-hidden h-full text-base-content border-base-300 border-r bg-base-200'>
      <div className='h-full flex justify-between safe-area'>
        <div className='flex-1 overflow-y-auto'>
          <NavLink
            to='new'
            className={({ isActive }) =>
              classNames('px-4 py-3 block text-center', {
                'bg-base-300': isActive
              })
            }
          >
            添加
          </NavLink>
          {assistantList.map(assistant => (
            <NavLink
              key={assistant.id}
              to={assistant.id}
              className={({ isActive }) =>
                classNames('px-4 py-3 block', {
                  'bg-base-300': isActive
                })
              }
            >
              {({ isActive }) => <AssistantItem isActive={isActive} assistant={assistant} />}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AssistantSidebar
