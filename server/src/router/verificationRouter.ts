import Router from 'koa-router'
import verificationServices from '../service/VerificationServices'

const verificationRouter = new Router()

// 发送验证码
verificationRouter.post('/send/:email', async ctx => {
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

verificationRouter.post('/register/:email/:code', async ctx => {
  const email = ctx.params.email
  const code = ctx.params.code

  try {
    const result = await verificationServices.verifyEmail(email, code)
    ctx.status = 200
    ctx.body = {
      success: true,
      message: '验证邮箱成功',
      data: result
    }
  } catch (error) {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: '验证邮箱失败',
      error: (error as Error).message
    }
  }
})

export default verificationRouter
