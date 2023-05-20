import userStore from '../store/UserStore'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { redirect } from 'react-router-dom'
import { assistantLoader } from './Assistant/AssistantId/loader'
import { assistantInteractionLoader } from './Assistant/AssistantId/InteractionId/loader'
import { assistantLayoutLoader } from './Assistant/loader'
import { AssistantLayoutAction } from './action'
import AssistantLayout from './Assistant/AssistantLayout'
import AssistantInteraction from './Assistant/AssistantId/InteractionId/Index'
import New from './Assistant/New/New'
import AssistantId from './Assistant/AssistantId/AssistantId'
import ErrorPage from './ErrorPage'
import Login from './Login/Login'
import { getAllAssistants } from './Assistant/service/assistant'

export const router = createBrowserRouter([
  {
    index: true,
    element: <Navigate to='/assistant' />
  },
  {
    path: '/',
    errorElement: <ErrorPage />,
    loader: () => {
      if (!userStore.isLogin) {
        return redirect('/login')
      }
      return null
    },
    children: [
      {
        path: 'assistant',
        element: <AssistantLayout />,
        loader: assistantLayoutLoader,
        action: AssistantLayoutAction,
        children: [
          {
            index: true,
            loader: async ({ params }) => {
              const { assistantId } = params
              const assistantList = await getAllAssistants()
              if (!assistantId) {
                if (assistantList.length > 0) {
                  const assistant = assistantList[0]
                  return redirect(`/assistant/${assistant.id}`)
                }
                return redirect('/assistant/new')
              }
              return {
                assistantList
              }
            }
          },
          {
            path: 'new',
            element: <New />
          },
          {
            path: ':assistantId',
            id: 'assistant',
            loader: assistantLoader,
            element: <AssistantId />,
            children: [
              {
                index: true,
                loader: assistantLoader
              },
              {
                path: ':interactionId',
                element: <AssistantInteraction />,
                loader: assistantInteractionLoader
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
])
