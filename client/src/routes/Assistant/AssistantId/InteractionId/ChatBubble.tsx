import classNames from 'classnames'
import dayjs from 'dayjs'
import { Message } from '../../types'
import OpenaiIcon from '../../../../components/OpenaiIcon'
import Avatar from '../../../../components/Avatar'
import userStore from '../../../../store/UserStore'
import MarkdownRenderer from '../../../../components/MarkdownRenderer/MarkdownRenderer'
import { AssistantWithLocal } from '../../../../service/assistant'

interface ChatBubbleProps extends Message {
  loading: boolean
  assistant: AssistantWithLocal
  onRetry?: (id: Message['id']) => void
  onDeleted?: (id: Message['id']) => void
  onUpdate?: (id: Message['id'], text: Message['content']) => void
}

const ChatBubble = (props: ChatBubbleProps) => {
  const {
    id,
    content: text = '正在思考中...',
    role,
    updatedAt,
    loading,
    assistant,
    onRetry,
    onDeleted,
    onUpdate
  } = props
  const isAssistant = role === 'assistant'

  const bubbleClassnames = 'prose-sm md:prose-md shadow chat-bubble bg-base-100 text-base-content p-3'

  return (
    <div className={`group chat ${isAssistant ? 'chat-start' : 'chat-end'}`}>
      {isAssistant ? (
        assistant.avatar ? (
          <Avatar className='chat-image w-10 rounded-full overflow-hidden' url={assistant.avatar} />
        ) : (
          <div className='chat-image avatar'>
            <div className='shrink-0 avatar w-10 h-10 rounded-full overflow-hidden'>
              <OpenaiIcon
                style={{
                  backgroundColor: 'rgb(16, 163, 127)'
                }}
                className='p-1.5 text-[#fff]'
              />
            </div>
          </div>
        )
      ) : (
        <Avatar className='chat-image w-10 rounded-full overflow-hidden' email={userStore.email} />
      )}
      {isAssistant ? (
        <div className='flex w-full'>
          <div className='flex-1 w-0'>
            <MarkdownRenderer className={classNames(bubbleClassnames)} text={text} />
          </div>
        </div>
      ) : (
        <div className={classNames(bubbleClassnames, 'whitespace-pre-wrap')}>{text}</div>
      )}
      <div className='group-hover:visible chat-footer pt-1 text-xs flex space-x-2'>
        <span className='opacity-40'>{dayjs(updatedAt).format('YY/MM/DD HH:mm')}</span>
        {onDeleted && (
          <button
            className='opacity-50 text-xs hover:text-primary hover:opacity-100'
            onClick={() => {
              onDeleted(id)
            }}
          >
            删除
          </button>
        )}
        {onRetry && role === 'assistant' && !loading && (
          <button
            className='opacity-50 text-xs hover:text-primary hover:opacity-100'
            onClick={() => {
              onRetry(id)
            }}
          >
            重试
          </button>
        )}
        {onUpdate && role === 'user' && (
          <button
            className='opacity-50 text-xs hover:text-primary hover:opacity-100'
            onClick={() => {
              const newMessage = prompt('编辑您消息', text)
              if (!newMessage) return
              onUpdate(id, newMessage)
            }}
          >
            编辑
          </button>
        )}
        {loading && <div className='loading loading-ring loading-xs' />}
      </div>
    </div>
  )
}

export default ChatBubble
