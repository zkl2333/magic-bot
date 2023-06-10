import { Controller, Get } from '@nestjs/common'
import { AssistantsService } from './assistants.service'
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Assistant } from '@prisma/client'

@ApiTags('Assistants')
@ApiBasicAuth()
@Controller('assistants')
export class AssistantsController {
  constructor(private readonly assistantsService: AssistantsService) {}

  @ApiOperation({ summary: '获取公共助手列表' })
  @Get()
  async listPublic(): Promise<Assistant[]> {
    return this.assistantsService.listPublicAssistants()
  }
}
