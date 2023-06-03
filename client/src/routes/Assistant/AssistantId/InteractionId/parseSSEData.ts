// 定义处理事件的接口
interface EventHandlers {
  message?: (data: string) => void
  error?: (err: string) => void
  [key: string]: ((data: string) => void) | undefined
}

// 实现 parseSSEData 函数
async function parseSSEData(response: Response, handlers: EventHandlers = {}) {
  const reader = response.body?.getReader()
  if (!reader) {
    handlers.error?.('No reader available')
    return
  }

  let decoder = new TextDecoder()
  let dataBuffer = ''
  let event = ''
  let eventType = 'message'

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    dataBuffer += decoder.decode(value)

    let lineEndIndex
    while ((lineEndIndex = dataBuffer.indexOf('\n')) >= 0) {
      const line = dataBuffer.slice(0, lineEndIndex).trim()
      dataBuffer = dataBuffer.slice(lineEndIndex + 1)

      if (line === '') {
        handlers[eventType]?.(event.trim())
        event = ''
        eventType = 'message'
      } else {
        const [key, value] = line.split(': ', 2) // ':' 后的空格是可选的，但常见
        if (key === 'event') {
          eventType = value
        } else if (key === 'data') {
          event += '\n' + value
        }
      }
    }
  }
}

export default parseSSEData
