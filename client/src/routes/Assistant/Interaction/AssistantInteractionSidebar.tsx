import { NavLink } from 'react-router-dom'
import { Interaction } from '../types'

const AssistantInteractionSidebar = ({ interactions }: { interactions: Interaction[] }) => {
  return (
    <div className='bg-base-200 w-60'>
      <ul className='menu p-4 w-60 text-base-content'>
        {interactions.map(interaction => (
          <li key={interaction.id}>
            <NavLink className='flex flex-col' to={`/assistant/${interaction.assistantId}/${interaction.id}`}>
              <div>{interaction.title || '未命名'}</div>
              <div>{new Date(interaction.createdAt).toLocaleString()}</div>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AssistantInteractionSidebar
