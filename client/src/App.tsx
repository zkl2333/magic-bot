import ChatBubble from './components/ChatBubble'
import { useState } from 'react'
import './App.css'
import AutoResizeTextarea from './components/AutoResizeTextarea'
import { ChatListItem } from './types'
import { chatStore } from './store/ChatStore'
import { observer } from 'mobx-react-lite'
import Navbar from './components/Navbar'
import ChatHistory from './components/ChatHistory'

function App() {
  const [inputText, setInputText] = useState('')

  const setAssistantMessage = async (response: Response) => {
    const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader()
    if (reader) {
      let answer = ''
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        answer += value
        chatStore.setAssistantMessage(answer)
      }
    }
  }

  const submitHandler = async () => {
    if (inputText === '') return
    setInputText('')
    chatStore.addChatItem({
      message: inputText,
      role: 'user'
    })
    chatStore.addChatItem({
      message: '',
      role: 'assistant'
    })
    await getAnswer(chatStore.chatList).then(setAssistantMessage)
  }

  const getAnswer = async (chatList: ChatListItem[]) => {
    return fetch('/api/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ chatList })
    })
  }

  return (
    <div className='h-full w-full transition-all p-0 lg:p-4'>
      <div className='h-full w-full overflow-hidden border lg:rounded-md lg:shadow-md'>
        <div className='drawer drawer-mobile h-full'>
          <input id='side-drawer' type='checkbox' className='drawer-toggle' />
          <div className='drawer-content flex flex-col'>
            <Navbar />
            {/* 聊天框 */}
            <div className='flex flex-1 flex-col p-3 lg:p-4 overflow-y-auto'>
              {chatStore.chatList.map((item, index) => (
                <ChatBubble key={index} role={item.role} message={item.message} />
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
              <ChatHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default observer(App)
