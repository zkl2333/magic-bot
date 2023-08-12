import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Role } from '@prisma/client'
import * as bcrypt from 'bcrypt'

@Injectable()
export class SystemService {
  constructor(private prisma: PrismaService) {}

  async isSystemReady() {
    const users = await this.prisma.user.findMany()
    return users.length > 0
  }

  async createAdminUser() {
    // 如果数据库中没有用户，则创建一个管理员用户
    const users = await this.prisma.user.findMany()
    if (users.length === 0) {
      return this.prisma.user.create({
        data: {
          email: 'admin@example.com',
          emailVerified: true,
          username: 'admin',
          password: await bcrypt.hash('password', 0),
          role: Role.ADMIN
        }
      })
    } else {
      throw new Error('已经存在用户，无法创建默认管理员用户')
    }
  }

  async getPublicConfig() {
    return this.prisma.config.findMany({
      where: {
        public: true
      }
    })
  }

  async getConfig() {
    return this.prisma.config.findMany()
  }

  async updateConfig(configs: { id: number; key: string; value: string; public: boolean }[]) {
    // upsert: 如果存在则更新，不存在则创建
    return Promise.all(
      configs.map(config => {
        return this.prisma.config.upsert({
          where: {
            key: config.key
          },
          update: {
            key: config.key,
            value: config.value,
            public: config.public
          },
          create: {
            key: config.key,
            value: config.value,
            public: config.public
          }
        })
      })
    )
  }
}
