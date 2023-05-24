import userStore from '../store/UserStore'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { redirect } from 'react-router-dom'
import { assistantLoader } from './Assistant/AssistantId/loader'
import { assistantInteractionLoader } from './Assistant/AssistantId/InteractionId/loader'
import { assistantLayoutLoader } from './Assistant/loader'
import { AssistantLayoutAction } from './Assistant/AssistantLayoutAction'
import AssistantLayout from './Assistant/AssistantLayout'
import AssistantInteraction from './Assistant/AssistantId/InteractionId/Index'
import New from './Assistant/New/New'
import AssistantId from './Assistant/AssistantId/AssistantId'
import ErrorPage from './ErrorPage'
import Login from './Login/Login'
import { getAllAssistants } from './Assistant/service/assistant'
import Root from './Root/Root'
import Settings from './Settings/Settings'
import User from './Settings/User/User'
import Security from './Settings/Security/Security'
import Balance from './Settings/Balance/Balance'
import Transactions from './Settings/Transactions/Transactions'
import { getUserInfo, getBalance, updateUserInfo } from '../service/user'

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: <Root />,
    loader: async () => {
      if (!userStore.isLogin) {
        return redirect('/login')
      }
      try {
        const user = await getUserInfo()
        userStore.setUser(user)
        return {
          user
        }
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
            element: <Navigate to='/settings/user' />
          },
          {
            path: 'user',
            element: <User />,
            loader: () => getUserInfo({ withInfo: true }),
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
