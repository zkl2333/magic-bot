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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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

  @ApiOperation({ summary: '获取用户助手列表' })
  @Get()
  findAssistants(@UserId() userId: string) {
    return this.assistantsService.listAssistantsByUserId(userId);
  }

  @ApiOperation({ summary: '创建用户助手' })
  @Post()
  async create(
    @UserId() userId: string,
    @Body() assistantData: CreateAssistantDto,
  ): Promise<Assistant> {
    return this.assistantsService.createAssistant(userId, assistantData);
  }

  @ApiOperation({ summary: '删除用户助手' })
  @Delete(':aid')
  async delete(
    @UserId() userId: string,
    @Param('aid', ParseIntPipe) assistantId: number,
  ): Promise<void> {
    return this.assistantsService.deleteAssistant(userId, assistantId);
  }

  @ApiOperation({ summary: '获取用户助手' })
  @Get(':aid')
  async get(
    @UserId() userId: string,
    @Param('aid', ParseIntPipe) assistantId: number,
  ): Promise<Assistant | null> {
    return this.assistantsService.getAssistant(userId, assistantId);
  }

  @ApiOperation({ summary: '更新用户助手' })
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
