import { useEffect } from 'react'
import './common/App.css'
import interactionStore from './store/InteractionStore'
import { Observer, observer } from 'mobx-react-lite'
import Navbar from './components/Navbar'
import InteractionList from './components/Interaction/InteractionList'
import { openLoginModal } from './components/LoginModal'
import modalStore from './store/ModalStore'
import Avatar from './components/Avatar'
import userStore from './store/UserStore'
import Interaction from './components/Interaction/Interaction'
import './common/daisyUI.less'

function App() {
  const isLogin = userStore.isLogin
  useEffect(() => {
    let close = () => {}
    if (!isLogin) {
      close = openLoginModal()
    }
    return () => {
      close()
    }
  }, [isLogin])

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
            <div className='overflow-hidden h-full w-60 text-base-content border-base-300 border-r bg-base-200'>
              <div className='h-full flex flex-col justify-between safe-area'>
                <div className='p-4 border-base-300 border-b'>
                  <button
                    className='btn btn-primary w-full'
                    onClick={() => {
                      interactionStore.createOrUpdateInteraction()
                    }}
                  >
                    新建交互
                  </button>
                </div>
                <div className='p-4 flex-1 overflow-y-auto'>
                  <InteractionList />
                </div>
                {isLogin && (
                  <>
                    <div className='flex justify-between items-center p-4 border-base-300 border-t'>
                      <Avatar className='w-10 rounded-full mr-2 overflow-hidden' email={userStore.email} />
                      <div className='flex-1'>{userStore.username}</div>
                      {/* 退出登录 */}
                      <button
                        className='btn btn-ghost btn-sm'
                        onClick={() => {
                          userStore.logout()
                        }}
                      >
                        退出
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
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
