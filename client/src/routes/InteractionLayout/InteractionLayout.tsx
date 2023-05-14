import { observer } from 'mobx-react-lite'
// import Interaction from '../components/Interaction/Interaction'
import Navbar from '../InteractionLayout/Navbar'
import Sidebar from '../InteractionLayout/Sidebar'
import userStore from '../../store/UserStore'
import { Outlet } from 'react-router-dom'

const InteractionLayout = () => {
  const isLogin = userStore.isLogin

  return (
    <>
      <div className='drawer drawer-mobile h-full'>
        <input id='side-drawer' type='checkbox' className='drawer-toggle' />
        <div className='safe-area drawer-content flex flex-col bg-base-200'>
          <Navbar />
          <Outlet />
        </div>
        <div className='drawer-side'>
          <label htmlFor='side-drawer' className='drawer-overlay'></label>
          <Sidebar isLogin={isLogin} />
        </div>
      </div>
    </>
  )
}

export default observer(InteractionLayout)
