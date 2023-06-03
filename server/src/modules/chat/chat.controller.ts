import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatDto } from './dto/chat.dto';
import { ChatService } from './chat.service';
import {
  CurrentUser,
  CurrentUserType,
} from 'src/common/decorators/currentUser.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Response } from 'express';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('completions')
  async getCompletions(
    @Res() res: Response,
    @CurrentUser() currentUser: CurrentUserType,
    @Body() body: ChatDto,
  ) {
    const dataStream = await this.chatService.createChatCompletion(
      currentUser.id,
      body,
    );
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    dataStream.pipe(res);
  }
}
