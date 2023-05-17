import userStore from '../store/UserStore'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from './Login/Login'
import ErrorPage from './ErrorPage'
import { redirect } from 'react-router-dom'
import AssistantLayout from './Assistant/AssistantLayout'
import AssistantInteraction from './Assistant/Interaction/Index'
import { assistantInteractionLoader, assistantLoader } from './Assistant/loader'

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
        ]
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
])
