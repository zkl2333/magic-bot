import { Context } from 'koa'
import VerificationServices from '../service/VerificationServices'

export const verifyEmail = async (ctx: Context) => {
  const email = ctx.params.email
  const code = ctx.params.code

  try {
    const result = await VerificationServices.verifyEmail(email, code)
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
}

export default {
  verifyEmail
}
