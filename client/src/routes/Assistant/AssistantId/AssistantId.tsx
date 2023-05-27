import { useEffect, useState } from 'react'
import { Outlet, useLoaderData, useFetcher, useOutletContext, useParams, useNavigate } from 'react-router-dom'
import { LocalAssistant, Interaction } from '../types'
import AssistantInteractionSidebar from './AssistantIdSidebar'
import { RootContextProps } from '../../Root/Root'
import { deleteInteraction, getInteraction } from '../../../service/interaction'
import { Assistant } from '../../../service/assistant'

export type AssistantIdContentProps = {
  showAssistantIdSidebar: boolean
  setAssistantIdShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

const AssistantId = () => {
  const { assistant } = useLoaderData() as { assistant: LocalAssistant & Assistant }
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [showAssistantIdSidebar, setAssistantIdShowSidebar] = useState(false)
  const fetcher = useFetcher()
  const { interactionId } = useParams()
  const navigate = useNavigate()

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

  const context = useOutletContext<RootContextProps>()

  const { setTitle } = context

  useEffect(() => {
    setTitle(assistant.name)

    if (!interactionId) {
      console.log('interactionId is null')
      const interactionId = assistant.interactionIds[0]
      navigate(`/assistant/${assistant.id}/${interactionId}`)
    }

    return () => {
      setTitle('')
    }
  }, [assistant.name])

  return (
    <div className='drawer h-full'>
      <input readOnly checked={showAssistantIdSidebar} type='checkbox' className='drawer-toggle' />
      <div className='drawer-content flex flex-col justify-between'>
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
