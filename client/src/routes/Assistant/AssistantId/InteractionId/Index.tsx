import { useLoaderData, useNavigate, useOutletContext, useRouteLoaderData } from 'react-router-dom'
import TextareaAutosize from '@mui/base/TextareaAutosize'
import { useEffect, useState } from 'react'
import { Message, Assistant, Interaction } from '../../types'
import { getMessage, addMessage, deleteMessage, updateMessage } from '../../service/message'
import { v4 as uuidv4 } from 'uuid'
import ChatBubble from './ChatBubble'
import { AssistantIdContentProps } from '../AssistantId'

const AssistantInteraction = () => {
  const { assistant } = useRouteLoaderData('assistant') as { assistant: Assistant }
  const { interaction } = useLoaderData() as { interaction: Interaction }
  const { setAssistantIdShowSidebar } = useOutletContext<AssistantIdContentProps>()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  const navigate = useNavigate()

  const fetchMessages = async () => {
    const fetchedMessages = await Promise.all(interaction.messageIds.map(getMessage))
    setMessages(fetchedMessages.filter(item => item !== null) as Message[])
  }

  // 获取聊天记录
  useEffect(() => {
    fetchMessages()
  }, [interaction.id])

  // 发送消息
  const sendMessage = async () => {
    if (input.trim() !== '') {
      const message = await addMessage(interaction.id, 'user', input)
      setMessages([...messages, message])
      setInput('')
    }
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
        {messages.map(message => (
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
        </div>
        {/* 输入 */}
        <TextareaAutosize
          className='outline-none mb-2 p-2 resize-none'
          minRows={1}
          maxRows={3}
          value={input}
          onChange={e => setInput(e.target.value)}
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
}

export default AssistantInteraction
