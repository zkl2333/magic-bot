import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Assistant } from '@prisma/client';
import { AssistantsService } from 'src/modules/assistants/assistants.service';
import { CreateAssistantDto } from 'src/modules/assistants/dto/create-assistant.dto';
import { UserId } from '../decorators/user-id.decorator';

@ApiTags('User Assistants')
@Controller('users/:id/assistants')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserAssistantsController {
  constructor(private readonly assistantsService: AssistantsService) {}

  @Get()
  findAssistants(@UserId() userId: string) {
    return this.assistantsService.listAssistantsByUserId(userId);
  }

  @Post()
  async create(
    @UserId() userId: string,
    @Body() assistantData: CreateAssistantDto,
  ): Promise<Assistant> {
    return this.assistantsService.createAssistant(userId, assistantData);
  }

  @Delete(':aid')
  async delete(
    @UserId() userId: string,
    @Param('aid', ParseIntPipe) assistantId: number,
  ): Promise<void> {
    return this.assistantsService.deleteAssistant(userId, assistantId);
  }

  @Get(':aid')
  async get(
    @UserId() userId: string,
    @Param('aid', ParseIntPipe) assistantId: number,
  ): Promise<Assistant | null> {
    return this.assistantsService.getAssistant(userId, assistantId);
  }

  @Put(':aid')
  async update(
    @UserId() userId: string,
    @Param('aid', ParseIntPipe) assistantId: number,
    @Body() assistantData: Partial<Assistant>,
  ): Promise<Assistant | null> {
    return this.assistantsService.updateAssistant(
      userId,
      assistantId,
      assistantData,
    );
  }
}
