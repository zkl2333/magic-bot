import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { SubscriptionService } from './subscription.service'
import { CreateSubscriptionDto } from './dto/create-subscription.dto'
import { DeleteSubscriptionDto } from './dto/delete-subscription.dto'
import { UpdateSubscriptionDto } from './dto/update-subscription.dto'
import { UpsertSubServiceLimitDto } from './dto/upsert-sub-service-limit.dto'
import serviceList from 'src/common/serviceList'

@ApiTags('subscription')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @ApiOperation({ summary: '获取所有订阅' })
  async listSubscription(@Query('limit') limit: boolean) {
    return this.subscriptionService.listSubscription(limit)
  }

  @Post()
  @ApiOperation({ summary: '创建订阅' })
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.createSubscription(createSubscriptionDto)
  }

  @Delete()
  @ApiOperation({ summary: '删除订阅' })
  async deleteSubscription(@Body() deleteSubscriptionDto: DeleteSubscriptionDto) {
    return this.subscriptionService.deleteSubscription(deleteSubscriptionDto)
  }

  @Put()
  @ApiOperation({ summary: '修改订阅' })
  async updateSubscription(@Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionService.updateSubscription(updateSubscriptionDto)
  }

  @Get('service')
  @ApiOperation({ summary: '获取所有服务' })
  async listService() {
    return serviceList
  }

  @Post('service-limit')
  @ApiOperation({ summary: '编辑服务限制' })
  async upsertServiceLimit(@Body() upsertSubServiceLimitDto: UpsertSubServiceLimitDto) {
    return this.subscriptionService.createServiceLimit(upsertSubServiceLimitDto)
  }
}
