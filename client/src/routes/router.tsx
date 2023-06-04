import userStore from '../store/UserStore'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { redirect } from 'react-router-dom'
import { assistantIdLoader } from './Assistant/AssistantId/assistantIdLoader'
import { assistantIdInteractionLoader } from './Assistant/AssistantId/InteractionId/loader'
import { assistantLayoutLoader } from './Assistant/assistantLayoutLoader'
import { assistantLayoutAction } from './Assistant/AssistantLayoutAction'
import AssistantLayout from './Assistant/AssistantLayout'
import AssistantInteraction from './Assistant/AssistantId/InteractionId/Index'
import New from './Assistant/New/New'
import AssistantId from './Assistant/AssistantId/AssistantId'
import ErrorPage from './ErrorPage'
import Login from './Login/Login'
import Root from './Root/Root'
import Settings from './Settings/Settings'
import User from './Settings/User/User'
import Security, { changePasswordAction } from './Settings/Security/Security'
import Balance, { balanceLoader } from './Settings/Balance/Balance'
import Transactions from './Settings/Transactions/Transactions'
import { getUserInfo, updateUserInfo } from '../service/user'
import Edit, { assistantEditAction as assistantIdEditAction } from './Assistant/AssistantId/Edit/Edit'
import assistantNewLoader from './Assistant/New/newLoader'
import { getAssistant } from '../service/assistant'
import requestHandler from '@/service/request'

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: <Root />,
    loader: async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        userStore.clear()
        console.log('no token')
        return redirect('/login')
      }
      if (userStore.isLogin) {
        return null
      }
      try {
        const user = await getUserInfo()
        userStore.setUser(user)
        return null
      } catch (error) {
        console.log(error)
        return redirect('/login')
      }
    },
    children: [
      {
        index: true,
        element: <Navigate to='/assistant' />
      },
      {
        path: '/settings',
        element: <Settings />,
        children: [
          {
            index: true,
            element: <Navigate to='/settings/user' replace />
          },
          {
            path: 'user',
            element: <User />,
            action: async ({ request }) => {
              const formData = await request.formData()
              const data = {
                email: formData.get('email') as string,
                username: formData.get('username') as string,
                nickname: formData.get('nickname') as string,
                settings: {
                  theme: formData.get('theme') as string
                }
              }
              const response = await updateUserInfo(data)
              const res = await response.json()
              if (res.success) {
                userStore.setUser({
                  ...userStore,
                  ...data
                })
                return res.data
              } else {
                return {
                  error: res.error
                }
              }
            }
          },
          {
            path: 'security',
            element: <Security />,
            action: changePasswordAction
          },
          {
            path: 'balance',
            element: <Balance />,
            loader: balanceLoader
          },
          {
            path: 'transactions',
            element: <Transactions />,
            loader: async ({ request, params }) => {
              console.log(request)
              console.log(params)
              const url = new URL(request.url)
              const page = url.searchParams.get('page')
              return await requestHandler('/api/users/me/transactions', {
                query: {
                  page: page || 1
                }
              })
            }
          }
        ]
      },
      {
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
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
])
