import interactionStore from '../../store/InteractionStore'
import Avatar from '../../components/Avatar'
import userStore from '../../store/UserStore'
import InteractionList from './Interaction/InteractionList'
import { useNavigate } from 'react-router-dom'

const Sidebar = ({ isLogin }: { isLogin: boolean }) => {
  const navigate = useNavigate()

  return (
    <div className='overflow-hidden h-full w-60 text-base-content border-base-300 border-r bg-base-200'>
      <div className='h-full flex flex-col justify-between safe-area'>
        <div className='p-4 border-base-300 border-b'>
          <button
            className='btn btn-primary w-full'
            onClick={() => {
              const id = interactionStore.createOrUpdateInteraction()
              console.log('new interaction id', id)
              navigate(`/interaction/${id}`)
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
              <Avatar
                className='flex-shrink-0 w-10 rounded-full mr-2 overflow-hidden'
                email={userStore.email}
              />
              <div className='flex-1 truncate'>{userStore.username}</div>
              {/* 退出登录 */}
              <button
                className='flex-shrink-0 btn btn-ghost btn-sm'
                onClick={() => {
                  userStore.logout()
                  navigate('/login', { replace: true })
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
