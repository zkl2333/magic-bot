const errorTemplate = `## 哎呀！好像坏掉啦！
1. 请稍后点击气泡下方的重试按钮。
2. 请稍后尝试重新加载页面，别担心，您的交互记录没有丢失。
3. 请尝试提供以下信息以便管理员快速定位问题：
`

export function formatChatErrorResponse(msg: object | string) {
  const tips = errorTemplate
  if (typeof msg === 'string') {
    try {
      return [tips, '```json\n', JSON.stringify(JSON.parse(msg), null, 2), '\n```'].join('')
    } catch (error) {
      return [tips, msg].join('')
    }
  } else if (typeof msg === 'object') {
    try {
      return [tips, '```json\n', JSON.stringify(msg, null, 2), '\n```'].join('')
    } catch (error) {
      return [tips, msg].join('')
    }
  } else {
    return tips
  }
}
