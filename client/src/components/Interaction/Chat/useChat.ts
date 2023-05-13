import { useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import interactionStore from '../../../store/InteractionStore'
import userStore from '../../../store/UserStore'
import { MessageItem } from '../../../types'

const useChat = () => {
  const [inputText, setInputText] = useState<string>('')
  const abortController = useRef(new AbortController())

  const stopAssistant = () => {
    abortController.current.abort()
    interactionStore.setInteractionLoading(interactionStore.currentInteractionId, false)
    abortController.current = new AbortController()
  }

  const setAssistantMessage = async (messageId: string, interactionId: string, response: Response) => {
    try {
      const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader()
      if (reader) {
        let answer = ''
        while (true) {
          const { value, done } = await reader.read()
          if (done) {
            interactionStore.createOrUpdateMessage({
              id: messageId,
              interactionId: interactionId,
              role: 'assistant',
              exclude: false,
              isFinish: true,
              message: answer
            })
            break
          }
          answer += value
          interactionStore.createOrUpdateMessage({
            id: messageId,
            interactionId: interactionId,
            exclude: false,
            isFinish: false,
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
        mode: interactionStore.currentInteraction.mode
      })
    }

    setInputText('')

    const messageId = uuidv4()
    interactionStore.createOrUpdateMessage({
      id: messageId,
      interactionId: interactionStore.currentInteractionId,
      isFinish: false,
      message: '思考中...',
      role: 'assistant'
    })

    const response = await getAnswer(interactionStore.currentInteractionIncludeMessages)
    setAssistantMessage(messageId, interactionStore.currentInteractionId, response)
  }

  const getAnswer = async (chatList: MessageItem[]) => {
    abortController.current = new AbortController()
    interactionStore.setInteractionLoading(interactionStore.currentInteractionId, true)
    return fetch('/api/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.token}`
      },
      body: JSON.stringify({ chatList }),
      signal: abortController.current.signal
    })
  }

  const retryHandler = async (messageId: string) => {
    const messageIndex = interactionStore.currentInteractionMessages.findIndex(item => item.id === messageId)
    const messageList = interactionStore.currentInteractionMessages
      .slice(0, messageIndex)
      .filter(item => !item.exclude)
    if (messageList.length === 0) {
      return
    }
    interactionStore.createOrUpdateMessage({
      id: messageId,
      interactionId: interactionStore.currentInteractionId,
      isFinish: false,
      message: '重新思考中...',
      role: 'assistant'
    })
    const response = await getAnswer(messageList)
    setAssistantMessage(messageId, interactionStore.currentInteractionId, response)
  }

  return {
    inputText,
    setInputText,
    stopAssistant,
    submitHandler,
    retryHandler
  }
}

export default useChat
