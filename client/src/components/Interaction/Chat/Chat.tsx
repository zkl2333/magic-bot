import { observer } from 'mobx-react-lite'
import interactionStore from '../../../store/InteractionStore'
import AutoResizeTextarea from '../../AutoResizeTextarea'
import ChatBubble from './ChatBubble'
import { useEffect, useState } from 'react'
import { MessageItem } from '../../../types'
import { v4 as uuidv4 } from 'uuid'
import classNames from 'classnames'

const Chat = () => {
  const [inputText, setInputText] = useState('')

  const setAssistantMessage = async (messageId: string, interactionId: string, response: Response) => {
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
          interactionStore.createOrUpdateMessage({
            id: messageId,
            interactionId: interactionId,
            role: 'assistant',
            message: answer
          })
        }
      }
    } catch (error) {}
    interactionStore.setInteractionLoading(interactionStore.currentInteractionId, false)
  }

  const submitHandler = async () => {
    if (inputText === '') return
    if (interactionStore.currentInteraction?.loading) return
    interactionStore.createOrUpdateMessage({
      interactionId: interactionStore.currentInteractionId,
      message: inputText,
      role: 'user'
    })

    if (interactionStore.currentInteraction?.title === '') {
      interactionStore.createOrUpdateInteraction({
        id: interactionStore.currentInteractionId,
        title: inputText,
        type: interactionStore.currentInteraction.type
      })
    }

    setInputText('')

    const messageId = uuidv4()
    interactionStore.createOrUpdateMessage({
      id: messageId,
      interactionId: interactionStore.currentInteractionId,
      message: '思考中...',
      role: 'assistant'
    })

    setTimeout(() => {
      // 滚动到底部
      const chatBox = document.querySelector('#chat-list')
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight
      }
    }, 30)
    const response = await getAnswer(interactionStore.currentInteractionIncludeMessages)
    setAssistantMessage(messageId, interactionStore.currentInteractionId, response)
  }

  const getAnswer = async (chatList: MessageItem[]) => {
    interactionStore.setInteractionLoading(interactionStore.currentInteractionId, true)
    return fetch('/api/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ chatList })
    })
  }

  const scrollToBottom = () => {
    const chatBox = document.querySelector('#chat-list')
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight
    }
  }

  const retryHandler = async (messageId: string) => {
    const messageIndex = interactionStore.currentInteractionIncludeMessages.findIndex(
      item => item.id === messageId
    )
    const messageList = interactionStore.currentInteractionIncludeMessages.slice(0, messageIndex)
    interactionStore.createOrUpdateMessage({
      id: messageId,
      interactionId: interactionStore.currentInteractionId,
      message: '重新思考中...',
      role: 'assistant'
    })
    const response = await getAnswer(messageList)
    setAssistantMessage(messageId, interactionStore.currentInteractionId, response)
  }

  useEffect(() => {
    scrollToBottom()
  }, [])

  return (
    <>
      {/* 聊天框 */}
      <div id='chat-list' className='flex flex-1 flex-col p-3 lg:p-4 overflow-y-auto overflow-x-hidden'>
        {interactionStore.currentInteractionMessages.map(item => (
          <ChatBubble {...item} key={item.id} retry={retryHandler} />
        ))}
      </div>
      {/* 输入框 */}
      <div className='flex-shrink-0 flex flex-row justify-between items-end m-2'>
        <AutoResizeTextarea
          onChange={inputText => setInputText(inputText)}
          value={inputText}
          onEnter={submitHandler}
        />
        <button
          className={classNames('btn btn-primary', {
            'loading btn-disabled': interactionStore.currentInteraction?.loading
          })}
          onClick={submitHandler}
        >
          发送
        </button>
      </div>
    </>
  )
}

export default observer(Chat)
