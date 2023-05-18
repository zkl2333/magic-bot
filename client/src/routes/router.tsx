import userStore from '../store/UserStore'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from './Login/Login'
import ErrorPage from './ErrorPage'
import { redirect } from 'react-router-dom'
import AssistantLayout from './Assistant/Layout/AssistantLayout'
import AssistantInteraction from './Assistant/Interaction/Index'
import { assistantInteractionLoader, assistantLoader } from './Assistant/loader'
import New from './Assistant/New/New'
import { addAssistant } from './Assistant/service/assistant'

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
            path: 'new',
            action: async ({ request }) => {
              let formData = await request.formData()
              try {
                const assistant = JSON.parse(formData.get('assistant') as string)
                await addAssistant(assistant)
                return redirect(`/assistant/${assistant.id}`)
              } catch (error) {
                console.log(error)
              }
              return null
            },
            element: <New />
          },
          {
            path: ':assistantId?/:interactionId?',
            element: <AssistantInteraction />,
            loader: assistantInteractionLoader
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
