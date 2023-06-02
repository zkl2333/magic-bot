import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

export const prisma = new PrismaClient()

export const changePassword = async (oldPasswordHere: string, newPassword: string, userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  })

  if (!user) {
    throw new Error('用户不存在')
  }

  const isPasswordValid = await bcrypt.compare(oldPasswordHere, user.password)

  if (!isPasswordValid) {
    throw new Error('无效的密码')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(newPassword, salt)

  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      password: hash
    }
  })
}

export default {
  changePassword
}
