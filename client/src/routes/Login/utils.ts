// 发送邮箱验证码
export const sendEmailCode = async (email: string) => {
  if (!/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email)) {
    return {
      success: false,
      message: '无效的邮箱格式'
    }
  }
  const response = await fetch(`/api/auth/sendEmailCode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  })
  const result = await response.json()
  return result
}
