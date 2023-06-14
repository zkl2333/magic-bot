import { BadRequestException, Injectable } from '@nestjs/common'
import { OrderCreateDto } from './dto/order-create.dto'
import { createHash } from 'crypto'
import { PrismaService } from 'src/prisma/prisma.service'
import { Order } from '@prisma/client'
import { PaymentCallbackDto } from './dto/payment-callback.dto'
import { AiProxyService } from 'src/common/aiProxy/ai-proxy.service'

const appSecret = 'XOR_SECRET'

// 利润率
const profitRate = 1.2
// 积分价格
const priceList = [
  { points: 10000, price: 10 * profitRate },
  { points: 20000, price: 20 * profitRate },
  { points: 50000, price: 50 * profitRate },
  { points: 100000, price: 100 * profitRate }
]

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService, private readonly aiProxyService: AiProxyService) {}

  // 获取套餐列表
  getPriceList(): { points: number; price: number }[] {
    return priceList
  }

  createSign({ order }: { order: Order }): string {
    const price = priceList.find(item => item.points === order.pointsPurchased).price
    const str = `${order.name}${order.payType}${price}${order.id}${order.notifyUrl}${appSecret}`
    const sign = createHash('md5').update(str).digest('hex')
    return sign
  }

  async createOrder(orderCreateDto: OrderCreateDto): Promise<Order> {
    const { orderUid } = orderCreateDto
    const user = await this.prisma.user.findUnique({
      where: {
        id: orderUid
      }
    })

    if (!user) {
      throw new BadRequestException('用户不存在')
    }

    const priceItem = priceList.find(item => item.points === +orderCreateDto.points)

    const createdOrder = await this.prisma.order.create({
      data: {
        name: orderCreateDto.name,
        payType: orderCreateDto.payType,
        notifyUrl: orderCreateDto.notifyUrl,
        pointsPurchased: priceItem.points,
        paymentAmount: priceItem.price,
        paymentStatus: 'Pending',
        updateStatus: 'Pending',
        retries: 0,
        User: {
          connect: {
            id: orderUid
          }
        }
      }
    })

    return createdOrder
  }

  async handlePaymentCallback(callbackData: PaymentCallbackDto) {
    const { aoid, order_id, pay_price, pay_time, sign } = callbackData

    // 验证签名
    const checkSign = createHash('md5')
      .update(`${aoid}${order_id}${pay_price}${pay_time}${appSecret}`)
      .digest('hex')
    if (checkSign !== sign) {
      throw new BadRequestException('签名错误')
    }

    // 验证订单是否存在
    const existingOrder = await this.prisma.order.findUnique({
      where: {
        id: order_id
      }
    })
    if (!existingOrder) {
      throw new BadRequestException('订单不存在')
    }

    // 验证积分充值是否已完成
    if (existingOrder.updateStatus === 'Completed') {
      return true
    }

    // 更新订单状态 已支付 未完成
    if (existingOrder.paymentStatus !== 'Paid') {
      await this.prisma.order.update({
        where: { id: order_id },
        data: {
          paymentAmount: pay_price,
          paymentTime: new Date(pay_time),
          paymentStatus: 'Paid',
          aoid: aoid
        }
      })
    } else {
      // 重试次数 +1
      await this.prisma.order.update({
        where: { id: order_id },
        data: {
          retries: {
            increment: 1
          }
        }
      })
    }

    try {
      // 调用 aip 添加积分
      await this.aiProxyService.addKeyPoints(existingOrder.userId, existingOrder.pointsPurchased)
    } catch (error) {
      // 更新订单状态 失败
      await this.prisma.order.update({
        where: { id: order_id },
        data: {
          updateStatus: 'Failed'
        }
      })
      throw error
    }

    // 更新订单状态 已完成
    await this.prisma.order.update({
      where: { id: order_id },
      data: {
        updateStatus: 'Completed'
      }
    })

    return true
  }
}
