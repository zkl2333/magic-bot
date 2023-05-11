import { Readable } from 'stream'

const chatCompletionsStreamFormatResponse = (stream: Readable) => {
  const readable = new Readable({
    read() {} // No-op, we'll push data manually
  })

  stream.on('data', data => {
    const lines = data
      .toString()
      .split('\n')
      .filter((line: string) => line.trim() !== '')

    for (const line of lines) {
      const message = line.replace(/^data:/, '').trim()
      if (message === '[DONE]') {
        readable.push(null) // Signal the end of the stream
        return
      }

      try {
        const parsed = JSON.parse(message)
        const content = parsed.choices[0].delta.content
        if (content) {
          readable.push(content)
        }
      } catch (error) {
        console.error('Could not JSON parse stream message', message, error)
      }
    }
  })

  return readable
}

// 将可读流转换为字符串
function streamToString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = ''
    stream.on('data', chunk => (data += chunk))
    stream.on('end', () => resolve(data))
    stream.on('error', error => reject(error))
  })
}

export { chatCompletionsStreamFormatResponse, streamToString }
