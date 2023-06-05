const errorTemplate = `## 哎呀！好像坏掉啦！
1. 请稍后点击气泡下方的重试按钮。
2. 请稍后尝试重新加载页面，别担心，您的交互记录没有丢失。
3. 请尝试提供以下信息以便管理员快速定位问题：
`

export function formatChatErrorResponse(msg: object | string) {
  const tips = errorTemplate
  let message
  let isJson = false

  try {
    message = JSON.stringify(typeof msg === 'string' ? JSON.parse(msg) : msg, null, 2)
    isJson = true // If JSON.stringify doesn't throw an error, the message is JSON
  } catch (error) {
    // If parsing or stringifying fails, use original message or empty string if it's an object
    message = typeof msg === 'string' ? msg : ''
  }

  return `${tips}\n\`\`\`${isJson ? 'json' : ''}\n${message}\n\`\`\``
}
