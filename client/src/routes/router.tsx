import userStore from '../store/UserStore'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { redirect } from 'react-router-dom'
import ErrorPage from './ErrorPage'
import Login from './Login/Login'
import Root from './Root/Root'
import { getUserInfo } from '../service/user'
import dashboardRouter from './Dashboard/dashbord.router'
import assistantRouter from './Assistant/assistant.router'

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
      dashboardRouter,
      assistantRouter
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
])
