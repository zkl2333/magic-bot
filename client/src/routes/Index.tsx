import { observer } from 'mobx-react-lite'
// import Interaction from '../components/Interaction/Interaction'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import userStore from '../store/UserStore'
import { Outlet } from 'react-router-dom'

const Index = () => {
  const isLogin = userStore.isLogin

  return (
    <>
      <div className='drawer drawer-mobile h-full'>
        <input id='side-drawer' type='checkbox' className='drawer-toggle' />
        <div className='safe-area drawer-content flex flex-col bg-base-200'>
          <Navbar />
          {/* <Interaction /> */}
          <Outlet />
        </div>
        <div className='drawer-side'>
          <label htmlFor='side-drawer' className='drawer-overlay'></label>
          {/* 侧边栏 */}
          <Sidebar isLogin={isLogin} />
        </div>
      </div>
    </>
  )
}

export default observer(Index)
