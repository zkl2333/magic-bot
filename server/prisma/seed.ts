const { PrismaClient, Role } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      username: 'admin',
      password: 'admin',
      role: Role.ADMIN
    }
  })

  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      username: 'user',
      password: 'user',
      role: Role.USER
    }
  })

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
