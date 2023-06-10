import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateServiceDto } from './dto/create-service.dto'
import { DeleteServiceDto } from './dto/delete-service.dto'
import { UpdateServiceDto } from './dto/update-service.dto'

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  listService() {
    return this.prisma.service.findMany()
  }

  createService(createServiceDto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        name: createServiceDto.name,
        description: createServiceDto.description || '',
        type: createServiceDto.type
      }
    })
  }

  deleteService(deleteServiceDto: DeleteServiceDto) {
    return this.prisma.service.delete({
      where: {
        id: +deleteServiceDto.id
      }
    })
  }

  updateService(createServiceDto: UpdateServiceDto) {
    return this.prisma.service.update({
      where: {
        id: +createServiceDto.id
      },
      data: {
        name: createServiceDto.name,
        description: createServiceDto.description || '',
        type: createServiceDto.type
      }
    })
  }
}
