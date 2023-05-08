import ChatBubble from './components/ChatBubble'
import { useEffect, useState } from 'react'
import './App.css'
import AutoResizeTextarea from './components/AutoResizeTextarea'
import { ChatListItem } from './types'
import chatStore from './store/ChatStore'
import { Observer, observer } from 'mobx-react-lite'
import Navbar from './components/Navbar'
import ChatHistory from './components/ChatHistory'
import { openLoginModal } from './components/LoginModal'
import modalStore from './store/ModalStore'
import useVerifyToken from './hooks/useVerifyToken'
import Avatar from './components/Avatar'
import userStore from './store/UserStore'

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

  const { isVerified, isLoading } = useVerifyToken()

  const isLogin = userStore.isLogin || (!isLoading && isVerified)

  useEffect(() => {
    let closeHandler = () => {}
    if (!isLogin) {
      closeHandler = openLoginModal()
    }
    return () => {
      closeHandler()
    }
  }, [isLoading, isVerified])

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
            <div className='flex flex-col justify-between w-60 p-4 bg-slate-50 text-base-content border-r'>
              <button className='btn btn-primary w-full bg-base-100 btn-outline'>新建对话</button>
              <div className='divider'></div>
              <div className='flex-1'>
                <ChatHistory />
              </div>
              {isLogin && (
                <>
                  <div className='divider'></div>
                  <div className='flex justify-between items-center'>
                    <Avatar className='w-10 rounded-full mr-5' email={userStore.email} />
                    <div className='flex-1'>{userStore.username}</div>
                    {/* 退出登录 */}
                    <button
                      className='btn btn-primary btn-outline'
                      onClick={() => {
                        userStore.logout()
                      }}
                    >
                      退出
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Observer>
        {() => (
          <>
            {modalStore.modals.map((modal, index) => {
              const { Component, props } = modal
              return <Component key={index} {...props} />
            })}
          </>
        )}
      </Observer>
    </div>
  )
}

export default observer(App)
