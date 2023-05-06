function formatResponse(msg: any) {
  const jsonMsg = ['```json\n', JSON.stringify(msg, null, '  '), '\n```'].join('')
  return jsonMsg
}

export default formatResponse
