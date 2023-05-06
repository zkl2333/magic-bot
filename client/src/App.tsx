import ChatBubble from './components/ChatBubble'
import { useState } from 'react'

import './App.css'
import AutoResizeTextarea from './components/AutoResizeTextarea'
const defaultChatList: ChatListItem[] = [
  {
    message: '多多是不是世界上最可爱的人',
    rule: 'user'
  },
  {
    message: '是的, 多多是世界上最可爱的人',
    rule: 'assistant'
  }
]

const chatHistory = [
  {
    title: 'new chat',
    content: "I don't know what you're talking about",
    time: '2021-08-01 12:00:00'
  },
  {
    title: "I don't know what you're talking about",
    content: "I don't know what you're talking about",
    time: '2021-08-01 12:00:00'
  }
]

type ChatListItem = {
  message: string
  rule: string
}

function App() {
  const [inputText, setInputText] = useState('')
  const [chatList, setChatList] = useState<ChatListItem[]>(defaultChatList)

  const submitHandler = () => {
    if (inputText === '') return
    setInputText('')
    setChatList([
      ...chatList,
      {
        message: inputText,
        rule: 'user'
      }
    ])
  }

  return (
    <div className='h-full w-full transition-all p-0 lg:p-4'>
      <div className='h-full w-full overflow-hidden border lg:rounded-md lg:shadow-md'>
        <div className='drawer drawer-mobile h-full'>
          <input id='side-drawer' type='checkbox' className='drawer-toggle' />
          <div className='drawer-content flex flex-col'>
            {/* 导航栏 */}
            <div className='w-full navbar border-b lg:hidden'>
              <div className='flex-none'>
                <label htmlFor='side-drawer' className='btn btn-square btn-ghost '>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    className='inline-block w-5 h-5 stroke-current'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M4 6h16M4 12h16M4 18h16'
                    ></path>
                  </svg>
                </label>
              </div>
            </div>
            {/* 聊天框 */}
            <div className='flex flex-1 flex-col p-3 lg:p-4 overflow-y-auto'>
              {chatList.map((item, index) => (
                <ChatBubble key={index} rule={item.rule} message={item.message} />
              ))}
            </div>
            {/* 输入框 */}
            <div className='flex-shrink-0 flex flex-row justify-between items-end m-2'>
              <AutoResizeTextarea
                onChange={inputText => setInputText(inputText)}
                value={inputText}
                onEnter={submitHandler}
              />
              <button className='btn btn-primary' onClick={submitHandler}>
                发送
              </button>
            </div>
          </div>
          <div className='drawer-side'>
            <label htmlFor='side-drawer' className='drawer-overlay'></label>
            {/* 侧边栏 */}
            <div className='w-60 p-4 bg-slate-50 text-base-content border-r'>
              <button className='btn btn-primary w-full bg-base-100 btn-outline'>新建对话</button>
              <div className='divider'></div>
              {chatHistory.map((item, index) => (
                <div
                  key={index}
                  className={'rounded-md w-full bg-base-100 shadow mb-3 last:mb-0 hover:shadow-md'}
                >
                  <div className='p-4'>{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
