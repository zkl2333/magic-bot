import './common/App.css'
import { observer } from 'mobx-react-lite'
import './common/daisyUI.less'
import userStore from './store/UserStore'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Index from './routes/Index'
import Login from './routes/Login'
import ErrorPage from './routes/ErrorPage'
import Interaction from './components/Interaction/Interaction'
import interactionStore from './store/InteractionStore'
import { redirect } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    errorElement: <ErrorPage />,
    loader: ({ params }) => {
      if (!userStore.isLogin) {
        return redirect('/login')
      }
      const { interactionId } = params
      if (interactionId === undefined && interactionStore.currentInteractionId) {
        return redirect(`/interaction/${interactionStore.currentInteractionId}`)
      }
      return null
    },
    children: [
      {
        errorElement: <ErrorPage />,
        path: 'interaction',
        children: [
          {
            path: ':interactionId',
            element: <Interaction />,
            loader: ({ params }) => {
              if (
                params?.interactionId &&
                interactionStore.interactions.find(interaction => interaction.id === params?.interactionId)
              ) {
                interactionStore.setCurrentInteractionId(params.interactionId)
              } else {
                throw new Error('记录不存在，可能已被删除')
              }
              return { interactionID: params.interactionId }
            }
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

function App() {
  return (
    <div data-theme={userStore.settings.theme} id='app' className='h-full w-full transition-all p-0 lg:p-4'>
      <div className='h-full w-full overflow-hidden border-base-200 lg:border lg:rounded-md lg:shadow-md'>
        <RouterProvider router={router} />
      </div>
    </div>
  )
}

export default observer(App)
