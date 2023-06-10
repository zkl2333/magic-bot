import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { SubscriptionService } from './subscription.service'
import { CreateServiceDto } from './dto/create-service.dto'
import { DeleteServiceDto } from './dto/delete-service.dto'
import { UpdateServiceDto } from './dto/update-service.dto'

@ApiTags('subscription')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  // 获取所有服务
  @Get('service')
  @ApiOperation({ summary: '获取所有服务' })
  async listService() {
    return this.subscriptionService.listService()
  }

  @Post('service')
  @ApiOperation({ summary: '创建服务' })
  async createService(@Body() createServiceDto: CreateServiceDto) {
    return this.subscriptionService.createService(createServiceDto)
  }

  @Delete('service')
  @ApiOperation({ summary: '删除服务' })
  async deleteService(@Body() deleteServiceDto: DeleteServiceDto) {
    return this.subscriptionService.deleteService(deleteServiceDto)
  }

  @Put('service')
  @ApiOperation({ summary: '修改服务' })
  async updateService(@Body() updateServiceDto: UpdateServiceDto) {
    return this.subscriptionService.updateService(updateServiceDto)
  }
}
