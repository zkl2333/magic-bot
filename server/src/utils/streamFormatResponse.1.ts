import { Readable } from 'stream'

// const { Readable } = require('stream')
const streamFormatResponse = (stream: Readable) => {
  const readable = new Readable({
    read() {} // No-op, we'll push data manually
  })

  stream.on('data', data => {
    const lines = data
      .toString()
      .split('\n')
      .filter((line: string) => line.trim() !== '')

    for (const line of lines) {
      const message = line.replace(/^data:/, '')
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
