import userAvatar from '../assets/user-avatar.jpg'
import OpenaiIcon from './OpenaiIcon'

interface ChatBubbleProps {
  message: string
  rule: string
}

const ChatBubble = (props: ChatBubbleProps) => {
  const { message, rule } = props
  const isAssistant = rule === 'assistant'
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
