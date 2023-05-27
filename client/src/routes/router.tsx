import userStore from '../store/UserStore'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { redirect } from 'react-router-dom'
import { assistantIdLoader } from './Assistant/AssistantId/loader'
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
import Security from './Settings/Security/Security'
import Balance from './Settings/Balance/Balance'
import Transactions from './Settings/Transactions/Transactions'
import { getUserInfo, getBalance, updateUserInfo } from '../service/user'
import Edit, { assistantEditAction as assistantIdEditAction } from './Assistant/AssistantId/Edit/Edit'
import assistantNewLoader from './Assistant/New/newLoader'

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: <Root />,
    loader: async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        userStore.clear()
        return redirect('/login')
      }
      if (userStore.isLogin) {
        return null
      }
      try {
        const user = await getUserInfo({
          withInfo: true
        })
        userStore.setUser(user)
        return null
      } catch (error) {
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
              const res = await updateUserInfo(data)
              if (res.ok) {
                return res
              } else {
                return {
                  error: await res.json()
                }
              }
            }
          },
          {
            path: 'security',
            element: <Security />
          },
          {
            path: 'balance',
            element: <Balance />,
            loader: getBalance
          },
          {
            path: 'transactions',
            element: <Transactions />
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
