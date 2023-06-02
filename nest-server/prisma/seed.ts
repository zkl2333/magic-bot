import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      emailVerified: true,
      username: 'admin',
      password: await bcrypt.hash('password', 0),
      role: Role.ADMIN
    }
  })

  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      emailVerified: true,
      username: 'user',
      password: await bcrypt.hash('password', 0),
      role: Role.USER
    }
  })
  console.log('Seeded')
  console.log({ admin, user })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
