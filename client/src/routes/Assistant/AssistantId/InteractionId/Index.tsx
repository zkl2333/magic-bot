import { useLoaderData, useNavigate, useOutletContext, useRouteLoaderData } from 'react-router-dom'
import TextareaAutosize from '@mui/base/TextareaAutosize'
import { useEffect, useRef } from 'react'
import { Message, Assistant, Interaction, BaseMessage } from '../../types'
import { getMessage, addMessage, deleteMessage, updateMessage } from '../../service/message'
import { v4 as uuidv4 } from 'uuid'
import ChatBubble from './ChatBubble'
import userStore from '../../../../store/UserStore'
import { AssistantIdContentProps } from '../AssistantId'
import { observer } from 'mobx-react-lite'
import chatStore from './store'

const AssistantInteraction = observer(() => {
  const { assistant } = useRouteLoaderData('assistant') as { assistant: Assistant }
  const { interaction } = useLoaderData() as { interaction: Interaction }
  const { setAssistantIdShowSidebar } = useOutletContext<AssistantIdContentProps>()
  const navigate = useNavigate()
  const abortController = useRef(new AbortController())

  const getReply = async (messages: BaseMessage[]) => {
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
  const sendMessage = async () => {
    if (chatStore.input.trim() !== '') {
      const message = await addMessage(interaction.id, 'user', chatStore.input)
      const newMessages = [...chatStore.messages, message]
      chatStore.setMessages(newMessages)
      chatStore.setInput('')
      const context = newMessages.slice(-assistant.modelConfig.context_size)
      generateReply(context)
    }
  }

  // 生成回复 异步流
  const generateReply = async (context: Message[]) => {
    const realContext = assistant.prompt ? [...assistant.prompt, ...context] : context
    const response = await getReply(realContext)
    let messageId = null
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
            onRetry={() => {}}
            onDeleted={async id => {
              await deleteMessage(id)
              fetchMessages()
            }}
            onUpdate={async (id, input) => {
              await updateMessage(id, input)
              fetchMessages()
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
            className='btn btn-xs btn-primary'
            onClick={async () => {
              navigate(`/assistant/${assistant.id}/${uuidv4()}`)
            }}
          >
            新话题
          </div>
          <label
            className='btn btn-primary btn-xs drawer-button'
            onClick={() => {
              setAssistantIdShowSidebar(true)
            }}
          >
            查看历史
          </label>
          <div className='btn btn-xs btn-primary' onClick={() => abortController.current.abort()}>
            中断
          </div>
        </div>
        {/* 输入 */}
        <TextareaAutosize
          className='outline-none mb-2 p-2 resize-none'
          minRows={1}
          maxRows={3}
          value={chatStore.input}
          onChange={e => chatStore.setInput(e.target.value)}
        />
        {/* 发送 */}
        <div className='flex flex-row-reverse overflow-hidden'>
          <button className='btn btn-sm lg:btn-md btn-primary' onClick={sendMessage}>
            发送
          </button>
        </div>
      </div>
    </>
  )
})

export default AssistantInteraction
