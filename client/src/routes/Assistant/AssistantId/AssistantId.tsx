import { useEffect, useState } from 'react'
import {
  Outlet,
  useLoaderData,
  useOutletContext,
  useNavigate,
  useLocation,
  useParams
} from 'react-router-dom'
import { Interaction } from '../types'
import AssistantInteractionSidebar from './AssistantIdSidebar'
import { RootContextProps } from '../../Root/Root'
import { deleteInteraction, getInteraction } from '../../../service/interaction'
import { AssistantWithLocal } from '../../../service/assistant'
import { createId } from '@paralleldrive/cuid2'
import { getLocalAssistant } from '@/service/localAssistant'

export type AssistantIdContentProps = {
  showAssistantIdSidebar: boolean
  setAssistantIdShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

const AssistantId = () => {
  const { assistant } = useLoaderData() as { assistant: AssistantWithLocal }
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [showAssistantIdSidebar, _setAssistantIdShowSidebar] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()

  const fetchInteractions = async () => {
    const localAssistant = await getLocalAssistant(assistant?.id)
    if (localAssistant) {
      const fetchedInteractions = await Promise.all(
        localAssistant.interactionIds.map(interactionId => getInteraction(interactionId))
      )
      setInteractions(fetchedInteractions.filter(item => item !== null) as Interaction[])
    }
  }

  const setAssistantIdShowSidebar = (showAssistantIdSidebar: React.SetStateAction<boolean>) => {
    fetchInteractions()
    _setAssistantIdShowSidebar(showAssistantIdSidebar)
  }

  const context = useOutletContext<RootContextProps>()

  const { setTitle } = context

  const navigateToInteraction = async () => {
    if (location.pathname === `/assistant/${assistant.id}`) {
      if (assistant.interactionIds.length === 0) {
        navigate(`/assistant/${assistant.id}/${createId()}`, { replace: true })
      } else {
        const interactionId = assistant.interactionIds[assistant.interactionIds.length - 1]
        navigate(`/assistant/${assistant.id}/${interactionId}`, { replace: true })
      }
    }
  }

  useEffect(() => {
    setTitle(assistant.name)
    navigateToInteraction()
    fetchInteractions()
    return () => {
      setTitle('')
    }
  }, [location])

  return (
    <div className='drawer h-full'>
      <input readOnly checked={showAssistantIdSidebar} type='checkbox' className='drawer-toggle' />
      <div className='drawer-content h-full overflow-hidden flex flex-col justify-between'>
        <Outlet context={{ ...context, showAssistantIdSidebar, setAssistantIdShowSidebar }} />
      </div>
      <div className='drawer-side h-full absolute z-10'>
        <label onClick={() => setAssistantIdShowSidebar(false)} className='drawer-overlay'></label>
        <AssistantInteractionSidebar
          interactions={interactions}
          onDelete={async id => {
            await deleteInteraction(id)
            await fetchInteractions()
            if (params.interactionId === id) {
              if (interactions.length === 0) {
                navigate(`/assistant/${assistant.id}/${createId()}`, { replace: true })
              } else {
                navigate(`/assistant/${assistant.id}/${interactions[0].id}`, {
                  replace: true
                })
              }
            }
          }}
        />
      </div>
    </div>
  )
}

export default AssistantId
