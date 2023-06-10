import requestHandler from '@/service/request'
import { updateUserInfo } from '@/service/user'
import userStore from '@/store/UserStore'
import { Navigate, RouteObject } from 'react-router-dom'
import Balance, { balanceLoader } from './Balance/Balance'
import Dashboard from './Dashboard'
import Security, { changePasswordAction } from './Security/Security'
import Transactions from './Transactions/Transactions'
import User from './User/User'
import Subscription from './Subscription/Subscription'
import Service, { serviceAction, serviceLoader } from './Service/Service'

const dashboardRouter: RouteObject = {
  path: '/dashboard',
  element: <Dashboard />,
  children: [
    {
      index: true,
      element: <Navigate to='/Dashboard/user' replace />
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
          Dashboard: {
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
    },
    {
      path: 'service',
      element: <Service />,
      loader: serviceLoader,
      action: serviceAction
    },
    {
      path: 'subscription',
      element: <Subscription />
    }
  ]
}

export default dashboardRouter
