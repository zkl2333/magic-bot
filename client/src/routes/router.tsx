import userStore from '../store/UserStore'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import InteractionLayout from './InteractionLayout/InteractionLayout'
import Login from './Login/Login'
import ErrorPage from './ErrorPage'
import Interaction from './InteractionLayout/Interaction/Interaction'
import interactionStore from '../store/InteractionStore'
import { redirect } from 'react-router-dom'
import AssistantLayout from './Assistant/AssistantLayout'
import AssistantInteraction from './Assistant/AssistantInteraction'
import assistantLoader from './Assistant/loader'

export const router = createBrowserRouter([
  {
    index: true,
    element: <Navigate to='/interaction' />
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
        loader: assistantLoader,
        children: [
          {
            index: true,
            element: <Navigate to={`/assistant/1`} />
          },
          {
            path: ':assistantId',
            element: <AssistantInteraction />
          }
        ]
      },
      {
        path: 'interaction',
        element: <InteractionLayout />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Navigate to={`/interaction/${interactionStore.currentInteractionId}`} />
          },
          {
            path: ':interactionId',
            element: <Interaction />,
            loader: ({ params }) => {
              if (
                params?.interactionId &&
                interactionStore.interactions.find(interaction => interaction.id === params?.interactionId)
              ) {
                interactionStore.setCurrentInteractionId(params.interactionId)
              } else {
                throw new Error('记录不存在，可能已被删除')
              }
              return { interactionID: params.interactionId }
            }
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
