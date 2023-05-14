import { useEffect } from 'react'
import interactionStore from '../store/InteractionStore'
import { openLoginModal } from './LoginModal'
import Avatar from './Avatar'
import userStore from '../store/UserStore'
import InteractionList from './Interaction/InteractionList'

const Sidebar = ({ isLogin }: { isLogin: boolean }) => {
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
  )
}

export default Sidebar
