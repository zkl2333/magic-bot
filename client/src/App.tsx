import './common/App.css'
import { observer } from 'mobx-react-lite'
import './common/daisyUI.less'
import userStore from './store/UserStore'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import Dialog from './components/PortalDialog'

function App() {
  return (
    <div data-theme={userStore.settings.theme} id='app' className='h-full w-full transition-all p-0 lg:p-4'>
      <div className='safe-area bg-base-200 h-full w-full overflow-hidden lg:border-base-300 lg:border lg:rounded-md lg:shadow-lg'>
        <RouterProvider router={router} />
      </div>
      <Dialog />
    </div>
  )
}

export default observer(App)
