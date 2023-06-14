import { Controller, Post, Body, UseGuards, HttpCode, Get } from '@nestjs/common'
import { OrderService } from './order.service'
import { OrderCreateDto } from './dto/order-create.dto'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { PaymentCallbackDto } from './dto/payment-callback.dto'
import { Public } from 'src/common/decorators/public.decorator'

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  async createOrder(@Body() orderCreateDto: OrderCreateDto) {
    const createdOrder = await this.orderService.createOrder(orderCreateDto)

    const sign = this.orderService.createSign({
      order: createdOrder
    })

    return {
      id: createdOrder.id,
      name: createdOrder.name,
      payType: createdOrder.payType,
      price: createdOrder.paymentAmount,
      userId: createdOrder.userId,
      notifyUrl: createdOrder.notifyUrl,
      sign: sign
    }
  }

  @Public()
  @Post('payment-callback')
  @HttpCode(200)
  async handlePaymentCallback(@Body() callbackData: PaymentCallbackDto): Promise<any> {
    return this.orderService.handlePaymentCallback(callbackData)
  }

  // 获取套餐列表
  @Get('price-list')
  async getPriceList(): Promise<any> {
    return this.orderService.getPriceList()
  }
}
