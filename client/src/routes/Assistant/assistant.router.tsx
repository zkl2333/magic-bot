import { getAssistant } from '@/service/assistant'
import AssistantId from './AssistantId/AssistantId'
import AssistantInteraction from './AssistantId/InteractionId/Index'
import { assistantIdInteractionLoader } from './AssistantId/InteractionId/loader'
import { assistantIdLoader } from './AssistantId/assistantIdLoader'
import AssistantLayout from './AssistantLayout'
import { assistantLayoutAction } from './AssistantLayoutAction'
import New from './New/New'
import { assistantLayoutLoader } from './assistantLayoutLoader'
import { RouteObject } from 'react-router-dom'
import assistantNewLoader from './New/newLoader'
import Edit, { assistantIdEditAction } from './AssistantId/Edit/Edit'

const assistantRouter: RouteObject = {
  path: '/assistant',
  element: <AssistantLayout />,
  loader: assistantLayoutLoader,
  action: assistantLayoutAction,
  children: [
    {
      path: 'new',
      element: <New />,
      loader: assistantNewLoader
    },
    {
      path: 'edit/:assistantId',
      element: <Edit />,
      loader: async ({ params }) => {
        const { assistantId } = params as { assistantId: string; interactionId: string }
        const assistant = await getAssistant(+assistantId)
        return {
          assistant: assistant
        }
      },
      action: assistantIdEditAction
    },
    {
      path: ':assistantId',
      id: 'assistant',
      loader: assistantIdLoader,
      element: <AssistantId />,
      children: [
        {
          path: 'edit',
          element: <Edit />,
          action: assistantIdEditAction
        },
        {
          path: ':interactionId',
          element: <AssistantInteraction />,
          loader: assistantIdInteractionLoader
        }
      ]
    }
  ]
}

export default assistantRouter
