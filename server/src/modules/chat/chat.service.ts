import { Injectable } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';
import { formatChatErrorResponse } from './utils';

@Injectable()
export class ChatService {
  getCompletions(userId: string, data: ChatDto) {
    return formatChatErrorResponse({ msg: '请求参数错误' });
  }
}
