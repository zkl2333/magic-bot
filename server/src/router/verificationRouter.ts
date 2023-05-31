import Router from 'koa-router'
import verificationServices from '../service/VerificationServices'

const verificationRouter = new Router()

// 发送验证码
verificationRouter.post('/emailSend/:email', async ctx => {
  const email = ctx.params.email

  try {
    const result = await verificationServices.sendEmail(email)
    ctx.status = 200
    ctx.body = {
      success: true,
      message: '发送验证码成功',
      data: result
    }
  } catch (error) {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: '发送验证码失败',
      error: (error as Error).message
    }
  }
})

export default verificationRouter
