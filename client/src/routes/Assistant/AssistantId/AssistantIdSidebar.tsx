import { NavLink } from 'react-router-dom'
import { Interaction } from '../types'
import classNames from 'classnames'

const AssistantInteractionSidebar = ({
  interactions,
  onDelete
}: {
  interactions: Interaction[]
  onDelete: (id: string) => {}
}) => {
  return (
    <div className='bg-base-200 w-60'>
      {interactions.map(interaction => (
        <NavLink
          key={interaction.id}
          className={({ isActive }) =>
            classNames('p-2 flex justify-between items-center', { 'bg-base-300': isActive })
          }
          to={`/assistant/${interaction.assistantId}/${interaction.id}`}
        >
          <div className='flex flex-col overflow-hidden'>
            <div className='text-lg truncate'>{interaction.title || '未命名'}</div>
            <div className='text-sm'>{new Date(interaction.createdAt).toLocaleString()}</div>
          </div>
          <div
            className='flex-shrink-0  p-2 opacity-40 hover:opacity-90 text-sm'
            onClick={async e => {
              e.preventDefault()
              onDelete(interaction.id)
            }}
          >
            删除
          </div>
        </NavLink>
      ))}
    </div>
  )
}

export default AssistantInteractionSidebar
