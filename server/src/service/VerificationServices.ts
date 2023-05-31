import { prisma } from '../controllers/userController'
import nodemailer from 'nodemailer'

async function getConfig(key: string) {
  const config = await prisma.config.findUnique({
    where: { key: key }
  })
  return config ? config.value : null
}

export const sendEmail = async (email: string) => {
  // Generate a random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString()

  // Update the user's VerificationCode in the database
  await prisma.verificationCode.upsert({
    where: {
      contact: email
    },
    update: { code: code, createdAt: new Date() },
    create: {
      code: code,
      contact: email,
      type: 'EMAIL'
    }
  })

  // Fetch config data from the database
  const emailService = await getConfig('emailService')
  const emailUser = await getConfig('emailUser')
  const emailPass = await getConfig('emailPass')

  // Check if we got all necessary config data
  if (!emailService || !emailUser || !emailPass) {
    throw new Error('Missing email config data')
  }

  // Configure your mail transporter
  let transporter = nodemailer.createTransport({
    service: emailService,
    secure: true,
    auth: {
      user: emailUser,
      pass: emailPass
    }
  })

  // Configure the email details
  let mailOptions = {
    from: emailUser,
    to: email,
    subject: '【神奇海螺】邮箱验证',
    html: `
    <p>亲爱的用户：</p>
    <p>您好！您正在神奇海螺进行邮箱验证，您的验证码为：</p>
    <h2>${code}</h2>
    <p>请在十分钟内输入此验证码完成验证。</p>
    <p>如果您并未进行此操作，请忽略此邮件。</p>
  `
  }

  // Send the email
  await transporter.sendMail(mailOptions)
}

export const verifyEmail = async (email: string, code: string) => {
  // Your service logic...
}

export default {
  verifyEmail,
  sendEmail
}
