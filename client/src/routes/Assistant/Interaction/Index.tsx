import { useLoaderData, useNavigate } from 'react-router-dom'
import AssistantInteractionSidebar from './AssistantInteractionSidebar'
import TextareaAutosize from '@mui/base/TextareaAutosize'
import { useEffect, useState } from 'react'
import { Message, Assistant, Interaction } from '../types'
import { getMessage, addMessage } from '../service/message'
import { getInteraction } from '../service/interaction'
import { v4 as uuidv4 } from 'uuid'
import ChatBubble from './ChatBubble'

const AssistantInteraction = () => {
  const { interaction, assistant } = useLoaderData() as { assistant: Assistant; interaction: Interaction }
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const navigate = useNavigate()

  const fetchMessages = async () => {
    const fetchedMessages = await Promise.all(interaction.messageIds.map(getMessage))
    setMessages(fetchedMessages.filter(item => item !== null) as Message[])
  }

  const fetchInteractions = async () => {
    const fetchedInteractions = await Promise.all(
      assistant.interactionIds.map(interactionId => getInteraction(interactionId))
    )
    setInteractions(fetchedInteractions.filter(item => item !== null) as Interaction[])
  }

  // 获取聊天记录
  useEffect(() => {
    fetchInteractions()
    fetchMessages()
  }, [interaction?.id])

  // 发送消息
  const sendMessage = async () => {
    if (input.trim() !== '') {
      const message = await addMessage(interaction.id, 'user', input)
      setMessages([...messages, message])
      setInput('')
      fetchInteractions()
    }
  }

  return (
    <div className='drawer h-full'>
      <input id='assistant-interaction-side-drawer' type='checkbox' className='drawer-toggle' />
      <div className='safe-area drawer-content flex flex-col justify-between'>
        {/* 对话列表 */}
        <div
          id='chat-list'
          className='flex flex-1 flex-col p-3 lg:p-4 overflow-y-auto overflow-x-hidden pb-[50px]'
        >
          {assistant.initialMessage && (
            <ChatBubble
              id={'0'}
              interactionId={interaction.id}
              text={assistant.initialMessage}
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
              onDeleted={() => {}}
              onUpdate={() => {}}
              assistant={assistant}
            />
          ))}
        </div>
        {/* 文本框 */}
        <div className='flex flex-col'>
          {/* 操作 */}
          <div className='flex p-2 space-x-2'>
            <label
              htmlFor='assistant-interaction-side-drawer'
              className='btn btn-primary btn-xs drawer-button'
            >
              查看历史
            </label>
            <div
              className='btn btn-xs btn-primary'
              onClick={async () => {
                navigate(`/assistant/${assistant.id}/${uuidv4()}`)
              }}
            >
              新话题
            </div>
          </div>
          {/* 输入 */}
          <TextareaAutosize minRows={4} value={input} onChange={e => setInput(e.target.value)} />
          {/* 发送 */}
          <div className='flex flex-row-reverse overflow-hidden'>
            <button className='btn btn-primary' onClick={sendMessage}>
              发送
            </button>
          </div>
        </div>
      </div>
      <div className='drawer-side'>
        <label htmlFor='assistant-interaction-side-drawer' className='drawer-overlay'></label>
        <AssistantInteractionSidebar interactions={interactions} />
      </div>
    </div>
  )
}

export default AssistantInteraction
