import { useEffect, useState } from 'react'
import { Outlet, useLoaderData, useFetcher } from 'react-router-dom'
import { getInteraction, deleteInteraction } from '../service/interaction'
import { Assistant, Interaction } from '../types'
import AssistantInteractionSidebar from './AssistantIdSidebar'

const AssistantId = () => {
  const { assistant } = useLoaderData() as { assistant: Assistant }
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [showSidebar, setShowSidebar] = useState(false)
  const fetcher = useFetcher()

  const fetchInteractions = async () => {
    const fetchedInteractions = await Promise.all(
      assistant.interactionIds.map(interactionId => getInteraction(interactionId))
    )
    setInteractions(fetchedInteractions.filter(item => item !== null) as Interaction[])
  }

  useEffect(() => {
    if (showSidebar) {
      fetcher.load('/assistant/' + assistant.id)
    }
  }, [showSidebar, assistant.id])

  useEffect(() => {
    fetchInteractions()
  }, [assistant.interactionIds])

  return (
    <div className='drawer h-full'>
      <input readOnly checked={showSidebar} type='checkbox' className='drawer-toggle' />
      <Outlet context={{ setShowSidebar }} />
      <div className='drawer-side'>
        <label onClick={() => setShowSidebar(false)} className='drawer-overlay'></label>
        <AssistantInteractionSidebar
          interactions={interactions}
          onDelete={async id => {
            await deleteInteraction(id)
            await fetchInteractions()
            fetcher.load('/assistant/' + assistant.id)
          }}
        />
      </div>
    </div>
  )
}

export default AssistantId
