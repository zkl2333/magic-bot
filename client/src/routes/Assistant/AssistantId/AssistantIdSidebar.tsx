import { NavLink } from 'react-router-dom'
import { Interaction } from '../types'
import classNames from 'classnames'
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone'

const AssistantInteractionSidebar = ({
  interactions,
  onDelete
}: {
  interactions: Interaction[]
  onDelete: (id: string) => {}
}) => {
  return (
    <div className='h-full bg-base-200 w-60 overflow-y-auto'>
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
          {interactions.length > 1 && (
            <HighlightOffTwoToneIcon
              className='flex-shrink-0 opacity-20 hover:opacity-70'
              fontSize='small'
              onClick={async e => {
                e.preventDefault()
                onDelete(interaction.id)
              }}
            />
          )}
        </NavLink>
      ))}
    </div>
  )
}

export default AssistantInteractionSidebar
