import './common/App.css'
import { observer } from 'mobx-react-lite'
import './common/daisyUI.less'
import userStore from './store/UserStore'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Index from './routes/Index'
import Login from './routes/Login'
import ErrorPage from './routes/ErrorPage'
import Interaction from './components/Interaction/Interaction'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Index />,
      ErrorBoundary: ErrorPage,
      children: [
        {
          path: 'interaction/:interactionId',
          element: <Interaction />,
          loader: ({ params }) => {
            return { interactionID: params.interactionId }
          }
        }
      ]
    },
    {
      path: '/login',
      element: <Login />,
      errorElement: <ErrorPage />
    }
  ])

  return (
    <div data-theme={userStore.settings.theme} id='app' className='h-full w-full transition-all p-0 lg:p-4'>
      <div className='h-full w-full overflow-hidden border-base-200 lg:border lg:rounded-md lg:shadow-md'>
        <RouterProvider router={router} />
      </div>
    </div>
  )
}

export default observer(App)
