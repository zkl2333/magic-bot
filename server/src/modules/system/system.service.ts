import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Role } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SystemService {
  constructor(private prisma: PrismaService, private configService: ConfigService) {}

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
    const configs = await this.prisma.config.findMany({
      where: {
        public: true
      }
    })
    return [
      {
        key: '25266',
        value: this.configService.get('25266')
      },
      ...configs
    ]
  }

  async getConfig() {
    return this.prisma.config.findMany()
  }

  async updateConfig(configs: { id: number; key: string; value: string; public: boolean }[]) {
    const oldConfigs = await this.prisma.config.findMany()
    const needDeleteIds = oldConfigs
      .filter(oldConfig => {
        return !configs.some(config => config.key === oldConfig.key)
      })
      .map(config => config.id)
    if (needDeleteIds.length > 0) {
      await this.prisma.config.deleteMany({
        where: {
          id: {
            in: needDeleteIds
          }
        }
      })
    }
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
