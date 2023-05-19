import { useLoaderData, useNavigate, useOutletContext, useRouteLoaderData } from 'react-router-dom'
import TextareaAutosize from '@mui/base/TextareaAutosize'
import { useEffect, useState } from 'react'
import { Message, Assistant, Interaction } from '../../types'
import { getMessage, addMessage, deleteMessage, updateMessage } from '../../service/message'
import { v4 as uuidv4 } from 'uuid'
import ChatBubble from './ChatBubble'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import Avatar from '../../../../components/Avatar'
import userStore from '../../../../store/UserStore'
import { AssistantIdContentProps } from '../AssistantId'
import { AssistantLayoutContextProps } from '../../AssistantLayout'

const AssistantInteraction = () => {
  const { assistant } = useRouteLoaderData('assistant') as { assistant: Assistant }
  const { interaction } = useLoaderData() as { interaction: Interaction }
  const { setAssistantIdShowSidebar, showAssistantLayoutSidebar, setAssistantLayoutShowSidebar } =
    useOutletContext<AssistantIdContentProps & AssistantLayoutContextProps>()
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
      <div className='navbar bg-base-200'>
        <button
          className='btn btn-square btn-ghost lg:hidden'
          onClick={() => {
            setAssistantLayoutShowSidebar(true)
          }}
        >
          <MenuIcon />
        </button>
        <div className='flex-1'>
          <a className='btn btn-ghost normal-case text-xl'>{assistant.name}</a>
        </div>
        <div className='flex-none'>
          <div className='dropdown dropdown-end'>
            <label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
              <Avatar className='w-10 rounded-full' email={userStore.email} />
            </label>
            <ul
              tabIndex={0}
              className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52'
            >
              <li>
                <a className='justify-between'>
                  Profile
                  <span className='badge'>New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
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
      <div className='flex flex-col p-2'>
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
          className='outline-none mb-2'
          minRows={4}
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
