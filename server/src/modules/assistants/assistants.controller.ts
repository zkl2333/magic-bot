import { Controller, Get } from '@nestjs/common';
import { AssistantsService } from './assistants.service';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { Assistant } from '@prisma/client';

@ApiTags('Assistants')
@ApiBasicAuth()
@Controller('assistants')
export class AssistantsController {
  constructor(private readonly assistantsService: AssistantsService) {}

  @Get()
  async listPublic(): Promise<Assistant[]> {
    return this.assistantsService.listPublicAssistants();
  }
}
