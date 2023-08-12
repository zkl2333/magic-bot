import requestHandler from '@/service/request'
import { updateUserInfo } from '@/service/user'
import userStore from '@/store/UserStore'
import { Navigate, RouteObject } from 'react-router-dom'
import Balance, { balanceLoader } from './Balance/Balance'
import Dashboard from './Dashboard'
import Security, { changePasswordAction } from './Security/Security'
import Transactions from './Transactions/Transactions'
import User from './User/User'
import Subscription, { subscriptionAction, subscriptionLoader } from './Subscription/Subscription'
import SubscriptionServiceLimit, {
  subscriptionServiceLimitAction,
  subscriptionServiceLimitLoader
} from './SubscriptionServiceLimit/SubscriptionServiceLimit'
import MySubscription, { mySubscriptionLoader } from './MySubscription/MySubscription'
import Config, { configLoader } from './Config/Config'

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
    },
    {
      path: 'my-subscription',
      element: <MySubscription />,
      loader: mySubscriptionLoader
    },
    {
      path: 'config',
      element: <Config />,
      loader: configLoader
    },
    {
      path: 'subscription',
      element: <Subscription />,
      loader: subscriptionLoader,
      action: subscriptionAction
    },
    {
      path: 'subscription-service-limit',
      element: <SubscriptionServiceLimit />,
      loader: subscriptionServiceLimitLoader,
      action: subscriptionServiceLimitAction
    }
  ]
}

export default dashboardRouter
