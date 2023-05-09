import { observer } from 'mobx-react-lite'
import sessionsStore from '../store/SessionsStore'
import chatStore from '../store/ChatStore'

const ChatHistory = () => {
  return (
    <>
      {sessionsStore.sessions.map((item, index) => (
        <div
          key={index}
          className={'rounded-md w-full bg-base-100 shadow mb-3 last:mb-0 hover:shadow-md p-4'}
          onClick={() => {
            chatStore.changeCurrentSession(item.id)
          }}
        >
          <div className='flex justify-between'>
            <div className='truncate flex-1'>{item.title || '未命名会话'}</div>
            <div
              className='btn btn-xs btn-ghost'
              onClick={e => {
                e.stopPropagation()
                sessionsStore.deleteSession(item.id)
                chatStore.initCurrentSession()
              }}
            >
              删除
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default observer(ChatHistory)
