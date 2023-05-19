import { useEffect, useState } from 'react'
import { Outlet, useLoaderData, useFetcher, useOutletContext } from 'react-router-dom'
import { getInteraction, deleteInteraction } from '../service/interaction'
import { Assistant, Interaction } from '../types'
import AssistantInteractionSidebar from './AssistantIdSidebar'
import { AssistantLayoutContextProps } from '../AssistantLayout'

export type AssistantIdContentProps = {
  showAssistantIdSidebar: boolean
  setAssistantIdShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

const AssistantId = () => {
  const { assistant } = useLoaderData() as { assistant: Assistant }
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [showAssistantIdSidebar, setAssistantIdShowSidebar] = useState(false)
  const fetcher = useFetcher()

  const fetchInteractions = async () => {
    const fetchedInteractions = await Promise.all(
      assistant.interactionIds.map(interactionId => getInteraction(interactionId))
    )
    setInteractions(fetchedInteractions.filter(item => item !== null) as Interaction[])
  }

  useEffect(() => {
    if (showAssistantIdSidebar) {
      fetcher.load('/assistant/' + assistant.id)
    }
  }, [showAssistantIdSidebar, assistant.id])

  useEffect(() => {
    fetchInteractions()
  }, [assistant.interactionIds])

  const context = useOutletContext<AssistantLayoutContextProps>()

  const { setTitle } = context

  useEffect(() => {
    setTitle(assistant.name)
    return () => {
      setTitle('')
    }
  }, [assistant.name])

  return (
    <div className='drawer h-full'>
      <input readOnly checked={showAssistantIdSidebar} type='checkbox' className='drawer-toggle' />
      <div className='safe-area drawer-content flex flex-col justify-between'>
        <Outlet context={{ ...context, showAssistantIdSidebar, setAssistantIdShowSidebar }} />
      </div>
      <div className='drawer-side'>
        <label onClick={() => setAssistantIdShowSidebar(false)} className='drawer-overlay'></label>
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
