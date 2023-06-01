import { useLoaderData, useNavigate, useOutletContext, useRouteLoaderData } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { Message, Interaction, BaseMessage } from '../../types'
import { getMessage, addMessage, deleteMessage, updateMessage } from '../../../../service/message'
import { createId } from '@paralleldrive/cuid2'

import ChatBubble from './ChatBubble'
import { AssistantIdContentProps } from '../AssistantId'
import { observer } from 'mobx-react-lite'
import chatStore from './store'
import classNames from 'classnames'
import AutoResizeTextarea from './AutoResizeTextarea'
import RestartIcon from './RestartIcon'
import StopIcon from './StopIcon'
import './index.css'
import { AssistantWithLocal } from '../../../../service/assistant'

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

const AssistantInteraction = observer(() => {
  const { assistant } = useRouteLoaderData('assistant') as { assistant: AssistantWithLocal }
  const { interaction } = useLoaderData() as { interaction: Interaction }
  const { setAssistantIdShowSidebar } = useOutletContext<AssistantIdContentProps>()
  const navigate = useNavigate()
  const abortController = useRef(new AbortController())

  const getAssistantReply = async (messages: BaseMessage[]) => {
    abortController.current = new AbortController()
    return fetch('/api/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ messages: messages, config: assistant.config }),
      signal: abortController.current.signal
    })
  }

  const fetchMessages = async () => {
    const fetchedMessages = await Promise.all(interaction.messageIds.map(getMessage))
    const nonNullMessages = fetchedMessages.filter(item => item !== null) as Message[]
    chatStore.setMessages(nonNullMessages)
  }

  // 获取聊天记录
  useEffect(() => {
    fetchMessages()
  }, [interaction.id])

  // 发送消息
  const sendUserMessage = async () => {
    if (chatStore.input.trim() !== '') {
      const message = await addMessage(interaction.id, 'user', chatStore.input)
      const newMessages = [...chatStore.messages, message]
      chatStore.setMessages(newMessages)
      chatStore.setInput('')
      const context = newMessages.slice(-assistant.config.context_size)
      generateAssistantReply(context)
    }
  }

  // 生成回复 异步流
  const generateAssistantReply = async (context: Message[]) => {
    const realContext = assistant.config.prompt ? [...assistant.config.prompt, ...context] : context
    const message = await addMessage(interaction.id, 'assistant', '思考中...')
    chatStore.addMessage(message)
    const messageId = message.id
    chatStore.setLoading(true)
    const response = await getAssistantReply(realContext)
    try {
      const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader()
      if (reader) {
        let answer = ''
        while (true) {
          const { value, done } = await reader.read()
          if (done) {
            break
          }
          answer += value
          await updateMessage(messageId, answer)
          chatStore.updateMessage(messageId, answer)
        }
      }
    } catch (error) {}
    chatStore.setLoading(false)
  }

  const onRetry = async (id?: string) => {
    let context: Message[] = []
    let needDeleteMessages: Message[] = []

    if (id) {
      const index = chatStore.messages.findIndex(item => item.id === id)
      let userMsgIndex = index
      for (let i = index - 1; i >= 0; i--) {
        if (chatStore.messages[i].role === 'user') {
          userMsgIndex = i
          break
        }
      }

      for (let i = userMsgIndex; i >= 0 && context.length < assistant.config.context_size; i--) {
        context.push(chatStore.messages[i])
      }

      needDeleteMessages = chatStore.messages.slice(userMsgIndex + 1)
      await Promise.all(needDeleteMessages.map(item => deleteMessage(item.id)))
      chatStore.removeMessages(needDeleteMessages.map(item => item.id))
      generateAssistantReply(context.reverse())
    } else {
      generateAssistantReply(chatStore.messages.slice(-assistant.config.context_size))
    }
  }

  return (
    <>
      {/* 对话列表 */}
      <div id='chat-list' className='flex flex-1 flex-col p-3 lg:p-4 overflow-y-auto overflow-x-hidden'>
        {assistant.config.initialMessage && (
          <ChatBubble
            id={'0'}
            interactionId={interaction.id}
            content={assistant.config.initialMessage}
            role='assistant'
            loading={false}
            createdAt={interaction.createdAt}
            updatedAt={interaction.createdAt}
            assistant={assistant}
          />
        )}
        {chatStore.messages.map(message => (
          <ChatBubble
            {...message}
            loading={false}
            key={message.id}
            onRetry={onRetry}
            onDeleted={async id => {
              await deleteMessage(id)
              chatStore.removeMessage(id)
            }}
            onUpdate={async (id, input) => {
              await updateMessage(id, input)
              chatStore.updateMessage(id, input)
            }}
            assistant={assistant}
          />
        ))}
      </div>
      {/* 文本框 */}
      <div className='flex flex-col p-2 border-t border-base-300'>
        {/* 操作 */}
        <div className='flex space-x-2 mb-2'>
          <div
            className={classNames('btn btn-xs', {
              // 'btn-disabled': chatStore.messages.length === 0
            })}
            onClick={async () => {
              navigate(`/assistant/${assistant.id}/${createId()}`)
            }}
          >
            新话题
          </div>
          <div
            className='btn btn-primary btn-xs drawer-button'
            onClick={() => {
              setAssistantIdShowSidebar(true)
            }}
          >
            查看历史
          </div>
        </div>
        {/* 输入框 */}
        <div className='flex-shrink-0 flex flex-row justify-between items-center bg-transparent'>
          <AutoResizeTextarea
            loading={chatStore.loading}
            value={chatStore.input}
            onChange={input => chatStore.setInput(input)}
            onSubmit={sendUserMessage}
            maxRows={5}
          />

          {chatStore.loading ? (
            <IconBtn onClick={() => abortController.current.abort()}>
              <StopIcon />
            </IconBtn>
          ) : (
            chatStore.messages.filter(item => item.role === 'user').length > 0 && (
              <IconBtn
                onClick={() => {
                  const lastAssistantMessage = chatStore.messages
                    .filter(item => item.role === 'assistant')
                    .slice(-1)?.[0]
                  if (lastAssistantMessage) {
                    onRetry(lastAssistantMessage.id)
                  } else {
                    onRetry()
                  }
                }}
              >
                <RestartIcon />
              </IconBtn>
            )
          )}
        </div>
      </div>
    </>
  )
})

export default AssistantInteraction
