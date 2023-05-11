function formatChatErrorResponse(msg: object | string) {
  const tips = `## 哎呀！服务器坏掉啦！\n1. 请稍后尝试重新加载页面，别担心，您的对交互记录没有丢失。\n2. 如问题持续存在，请及时联系管理员。\n`
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

export { formatChatErrorResponse }
