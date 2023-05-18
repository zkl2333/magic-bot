import userStore from '../store/UserStore'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from './Login/Login'
import ErrorPage from './ErrorPage'
import { redirect } from 'react-router-dom'
import AssistantLayout from './Assistant/AssistantLayout'
import AssistantInteraction from './Assistant/Interaction/Index'
import { assistantInteractionLoader, assistantLoader } from './Assistant/loader'
import { deleteInteraction } from './Assistant/service/interaction'

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
        loader: assistantLoader,
        children: [
          {
            path: ':assistantId?/:interactionId?',
            element: <AssistantInteraction />,
            loader: assistantInteractionLoader
          }
          // {
          //   path: ':assistantId/:interactionId/delete',
          //   action: async ({ request, params }) => {
          //     console.log(request, params)
          //     // const { assistantId, interactionId } = params
          //     // await deleteInteraction(interactionId!)
          //     // return redirect(`/assistant/${assistantId}`)
          //   }
          // }
        ]
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
])
