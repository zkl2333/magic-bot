import userAvatar from '../assets/user-avatar.jpg'
import { ChatListItem } from '../types'
import OpenaiIcon from './OpenaiIcon'

const ChatBubble = (props: ChatListItem) => {
  const { message, role } = props
  const isAssistant = role === 'assistant'
  return (
    <div className={`chat ${isAssistant ? 'chat-start' : 'chat-end'}`}>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          {isAssistant ? (
            <div className='text-white bg-black p-1.5'>
              <OpenaiIcon />
            </div>
          ) : (
            <img src={userAvatar} />
          )}
        </div>
      </div>
      <div className={`chat-bubble chat-bubble-success ${isAssistant ? 'bg-base-200' : ''}`}>{message}</div>
    </div>
  )
}

export default ChatBubble
