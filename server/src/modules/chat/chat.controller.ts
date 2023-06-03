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
import { Configuration, OpenAIApi } from 'openai';
import { Readable } from 'node:stream';
import { IncomingMessage } from 'node:http';
import { chatCompletionsStreamFormatResponse } from './utils';

const baseUrl = 'https://api.aiproxy.io/v1';
const apiKey = 'ap-gYU7bfjqMApGuUN5UKDz9IS1UIwbYlrm7mx6dTFwfF283azA';

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
    const configuration = new Configuration({
      basePath: baseUrl,
      apiKey: apiKey,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion(
      {
        ...body.config,
        stream: true,
        messages: [
          {
            role: 'user',
            content: 'Hello, how are you?',
          },
        ],
      },
      { responseType: 'stream' },
    );
    res.setHeader('Content-Type', 'event-stream');
    (response.data as unknown as IncomingMessage).pipe(res);
  }
}
