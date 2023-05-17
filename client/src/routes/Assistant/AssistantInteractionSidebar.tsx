import { useEffect, useState } from 'react'
import { getInteraction } from './Service'
import { Assistant, Interaction } from './types'
import { NavLink } from 'react-router-dom'

const AssistantInteractionSidebar = ({ assistant }: { assistant: Assistant }) => {
  const [interaction, setInteraction] = useState<Interaction[]>([])

  const fetchInteractions = async () => {
    const fetchedInteractions = await Promise.all(
      assistant.interactionIds.map(interactionId => getInteraction(interactionId))
    )
    setInteraction(fetchedInteractions.filter(item => item !== null) as Interaction[])
  }

  useEffect(() => {
    fetchInteractions()
  }, [assistant.id])
  return (
    <div className='bg-base-200 w-60'>
      <ul className='menu p-4 w-60 text-base-content'>
        {interaction.map(interaction => (
          <li key={interaction.id}>
            <NavLink to={`/assistant/${assistant.id}/${interaction.id}`}>{interaction.id}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AssistantInteractionSidebar
