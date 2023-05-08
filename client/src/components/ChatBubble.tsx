import classNames from 'classnames'
import userStore from '../store/UserStore'
import { ChatListItem } from '../types'
import Avatar from './Avatar'
import OpenaiIcon from './OpenaiIcon'

const ChatBubble = (props: ChatListItem) => {
  const { message, role } = props
  const isAssistant = role === 'assistant'

  return (
    <div className={`chat ${isAssistant ? 'chat-start' : 'chat-end'}`}>
      {isAssistant ? (
        <div className='chat-image avatar'>
          <div className='w-10 rounded-full text-white bg-black p-1.5'>
            <OpenaiIcon />
          </div>
        </div>
      ) : (
        <Avatar className='chat-image w-10 rounded-full overflow-hidden' email={userStore.email} />
      )}
      <div
        className={classNames('chat-bubble', {
          'chat-bubble-primary': !isAssistant
        })}
      >
        {message}
      </div>
    </div>
  )
}

export default ChatBubble
