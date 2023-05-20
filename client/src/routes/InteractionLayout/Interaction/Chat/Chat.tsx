import { observer } from 'mobx-react-lite'
import interactionStore from '../../../../store/InteractionStore'
import AutoResizeTextarea from '../../../Assistant/AssistantId/InteractionId/AutoResizeTextarea'
import ChatBubble from './ChatBubble'
import { useEffect } from 'react'
import useChat from './useChat'
import classNames from 'classnames'

const IconBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <div className='ml-1 md:ml-2 h-full inline-flex rounded-md items-center justify-center hover:bg-base-300 min-w-[25px] md:min-w-[40px] relative'>
    <button
      {...props}
      className={classNames('h-full flex w-full gap-2 items-center justify-center', props.className)}
    >
      {children}
    </button>
  </div>
)
const Chat = () => {
  const { inputText, setInputText, stopAssistant, submitHandler, retryHandler } = useChat()

  const scrollToBottom = () => {
    const chatBox = document.querySelector('#chat-list')
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [])

  return (
    <>
      {/* 聊天框 */}
      <div
        id='chat-list'
        className='flex flex-1 flex-col p-3 lg:p-4 overflow-y-auto overflow-x-hidden pb-[50px]'
      >
        {interactionStore.currentInteractionMessages.map(item => (
          <ChatBubble {...item} key={item.id} retry={retryHandler} />
        ))}
      </div>
      {/* 输入框 */}
      <div className='flex-shrink-0 flex flex-row justify-between items-center p-2 bg-transparent'>
        <AutoResizeTextarea
          onChange={inputText => setInputText(inputText)}
          value={inputText}
          onSubmit={submitHandler}
        />
        {!interactionStore.currentInteraction?.loading &&
          interactionStore.currentInteractionIncludeMessages[
            interactionStore.currentInteractionIncludeMessages.length - 1
          ]?.role === 'assistant' && (
            <IconBtn
              onClick={() => {
                const interaction = interactionStore.currentInteractionMessages
                  .filter(item => item.role === 'assistant')
                  .pop()
                if (interaction) {
                  retryHandler(interaction.id)
                }
              }}
            >
              <svg
                stroke='currentColor'
                fill='none'
                strokeWidth='2'
                viewBox='0 0 24 24'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='h-4 w-4 flex-shrink-0'
                height='1em'
                width='1em'
                xmlns='http://www.w3.org/2000/svg'
              >
                <polyline points='1 4 1 10 7 10'></polyline>
                <polyline points='23 20 23 14 17 14'></polyline>
                <path d='M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15'></path>
              </svg>
            </IconBtn>
          )}

        {interactionStore.currentInteraction?.loading && (
          <IconBtn onClick={() => stopAssistant()}>
            <svg
              stroke='currentColor'
              fill='none'
              strokeWidth='2'
              viewBox='0 0 24 24'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='h-4 w-4'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect>
            </svg>
          </IconBtn>
        )}
      </div>
    </>
  )
}

export default observer(Chat)
