import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { Public } from 'src/common/decorators/public.decorator'
import { SystemService } from './system.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { Roles } from 'src/common/decorators/roles.decorator'
import { Role } from '@prisma/client'

@ApiTags('system')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Public()
  @Get('isSystemReady')
  @ApiOperation({ summary: '是否系统已经准备好' })
  async isSystemReady() {
    return this.systemService.isSystemReady()
  }

  @Public()
  @Post('initSystem')
  @ApiOperation({ summary: '初始化系统' })
  async initSystem() {
    return this.systemService.createAdminUser()
  }

  @Public()
  @Get('publicConfig')
  @ApiOperation({ summary: '获取公共配置' })
  async getPublicConfig() {
    return this.systemService.getPublicConfig()
  }

  @Get('getConfig')
  @ApiOperation({ summary: '获取所有配置' })
  async getConfig() {
    return this.systemService.getConfig()
  }

  @Post('updateConfig')
  @ApiOperation({ summary: '更新配置' })
  async updateConfig(@Body() body: { id: number; key: string; value: string; public: boolean }[]) {
    return this.systemService.updateConfig(body)
  }
}
