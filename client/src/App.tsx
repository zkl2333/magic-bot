import './common/App.css'
import { Observer, observer } from 'mobx-react-lite'
import './common/daisyUI.less'
import userStore from './store/UserStore'
import modalStore from './store/ModalStore'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Index from './view/Index'
import Login from './view/Login'
import ErrorPage from './view/ErrorPage'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Index />,
      errorElement: <ErrorPage />
      // children: [
      //   {
      //     path: 'interaction/:interaction',
      //     element: <Interaction />
      //   }
      // ]
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
      <Observer>
        {() => (
          <>
            {modalStore.modals.map((modal, index) => {
              const { Component, props } = modal
              return <Component key={index} {...props} />
            })}
          </>
        )}
      </Observer>
    </div>
  )
}

export default observer(App)
