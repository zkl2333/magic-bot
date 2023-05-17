import { useLoaderData } from 'react-router-dom'
import AssistantInteractionSidebar from '../AssistantInteractionSidebar'
import TextareaAutosize from '@mui/base/TextareaAutosize'
import { useEffect, useState } from 'react'
import { Message, getMessage, addMessage, Assistant, Interaction } from '../Service'

const AssistantInteraction = () => {
  const { interaction, assistant } = useLoaderData() as { assistant: Assistant; interaction: Interaction }
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  // 获取聊天记录
  useEffect(() => {
    console.log(interaction)
    async function fetchMessages() {
      const fetchedMessages = await Promise.all(interaction.messageIds.map(getMessage))
      setMessages(fetchedMessages.filter(item => item !== null) as Message[])
    }

    fetchMessages()
  }, [interaction?.id])

  // 发送消息
  const sendMessage = async () => {
    if (input.trim() !== '') {
      const message = await addMessage(interaction.id, input)
      setMessages([...messages, message])
      setInput('')
    }
  }

  return (
    <div className='drawer h-full'>
      <input id='assistant-interaction-side-drawer' type='checkbox' className='drawer-toggle' />
      <div className='safe-area drawer-content flex flex-col justify-between'>
        {/* 对话列表 */}
        <div>
          <ul>
            {messages.map(message => (
              <li key={message.id}>
                <p>{message.text}</p>
                <small>{new Date(message.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </div>
        {/* 文本框 */}
        <div className='flex flex-col'>
          {/* 操作 */}
          <div>
            <label htmlFor='assistant-interaction-side-drawer' className='btn btn-primary drawer-button'>
              查看历史
            </label>
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
        <AssistantInteractionSidebar assistant={assistant} />
      </div>
    </div>
  )
}

export default AssistantInteraction
