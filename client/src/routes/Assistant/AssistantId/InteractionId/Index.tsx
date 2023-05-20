import { useLoaderData, useNavigate, useOutletContext, useRouteLoaderData } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { Message, Assistant, Interaction, BaseMessage } from '../../types'
import { getMessage, addMessage, deleteMessage, updateMessage } from '../../service/message'
import { v4 as uuidv4 } from 'uuid'
import ChatBubble from './ChatBubble'
import userStore from '../../../../store/UserStore'
import { AssistantIdContentProps } from '../AssistantId'
import { observer } from 'mobx-react-lite'
import chatStore from './store'
import classNames from 'classnames'
import AutoResizeTextarea from './AutoResizeTextarea'
import RestartIcon from './RestartIcon'
import StopIcon from './StopIcon'
import './index.css'

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
  const { assistant } = useRouteLoaderData('assistant') as { assistant: Assistant }
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
        Authorization: `Bearer ${userStore.token}`
      },
      body: JSON.stringify({ messages: messages, modelConfig: assistant.modelConfig }),
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
      const context = newMessages.slice(-assistant.modelConfig.context_size)
      generateAssistantReply(context)
    }
  }

  // 生成回复 异步流
  const generateAssistantReply = async (context: Message[]) => {
    const realContext = assistant.prompt ? [...assistant.prompt, ...context] : context
    const response = await getAssistantReply(realContext)
    let messageId = null
    chatStore.setLoading(true)
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
          if (!messageId) {
            const message = await addMessage(interaction.id, 'assistant', answer)
            chatStore.addMessage(message)
            messageId = message.id
          } else {
            await updateMessage(messageId, answer)
            chatStore.updateMessage(messageId, answer)
          }
        }
      }
    } catch (error) {}
    chatStore.setLoading(false)
  }

  const onRetry = async (id: string) => {
    const index = chatStore.messages.findIndex(item => item.id === id)
    const context: Message[] = []
    for (let i = index - 1; i >= 0; i--) {
      if (chatStore.messages[i].role === 'user') {
        context.push(chatStore.messages[i])
      }
      if (context.length === assistant.modelConfig.context_size) {
        break
      }
    }
    const needDeleteMessages = chatStore.messages.slice(index)
    await Promise.all(needDeleteMessages.map(item => deleteMessage(item.id)))
    chatStore.removeMessages(needDeleteMessages.map(item => item.id))
    generateAssistantReply(context.reverse())
  }

  return (
    <>
      {/* 对话列表 */}
      <div id='chat-list' className='flex flex-1 flex-col p-3 lg:p-4 overflow-y-auto overflow-x-hidden'>
        {assistant.initialMessage && (
          <ChatBubble
            id={'0'}
            interactionId={interaction.id}
            content={assistant.initialMessage}
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
            className={classNames('btn btn-xs btn-primary', {
              'btn-disabled': chatStore.messages.length === 0
            })}
            onClick={async () => {
              navigate(`/assistant/${assistant.id}/${uuidv4()}`)
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
            chatStore.messages.length > 0 && (
              <IconBtn
                onClick={() => {
                  onRetry(chatStore.messages.slice(-1)[0].id)
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
