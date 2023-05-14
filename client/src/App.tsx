import './common/App.css'
import { Observer, observer } from 'mobx-react-lite'
import Navbar from './components/Navbar'
import Interaction from './components/Interaction/Interaction'
import './common/daisyUI.less'
import Sidebar from './components/Sidebar'
import userStore from './store/UserStore'
import modalStore from './store/ModalStore'

function App() {
  const isLogin = userStore.isLogin

  return (
    <div data-theme={userStore.settings.theme} id='app' className='h-full w-full transition-all p-0 lg:p-4'>
      <div className='h-full w-full overflow-hidden border-base-200 lg:border lg:rounded-md lg:shadow-md'>
        <div className='drawer drawer-mobile h-full'>
          <input id='side-drawer' type='checkbox' className='drawer-toggle' />
          <div className='safe-area drawer-content flex flex-col bg-base-200'>
            <Navbar />
            <Interaction />
          </div>
          <div className='drawer-side'>
            <label htmlFor='side-drawer' className='drawer-overlay'></label>
            {/* 侧边栏 */}
            <Sidebar isLogin={isLogin} />
          </div>
        </div>
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
