import { Injectable } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';
import { IncomingMessage } from 'node:http';
import { Configuration, OpenAIApi } from 'openai';
import { AiProxyService } from 'src/common/aiProxy/ai-proxy.service';

const baseUrl = 'https://api.aiproxy.io/v1';

@Injectable()
export class ChatService {
  constructor(private aiProxyService: AiProxyService) {}
  async createChatCompletion(
    uid: string,
    body: ChatDto,
  ): Promise<IncomingMessage> {
    const apiKey = await this.aiProxyService.fetchApiKey(uid);

    const configuration = new Configuration({
      basePath: baseUrl,
      apiKey: apiKey,
    });

    const openai = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion(
      {
        ...body.config,
        stream: true,
        messages: body.messages,
      },
      { responseType: 'stream' },
    );
    return response.data as unknown as IncomingMessage;
  }
}
