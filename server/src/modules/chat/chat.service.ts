import { Injectable } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';
import { IncomingMessage } from 'node:http';
import { Configuration, OpenAIApi } from 'openai';
import { AiProxyService } from 'src/common/aiProxy/ai-proxy.service';
import { Readable } from 'node:stream';
import {
  AccountBannedException,
  InsufficientBalanceException,
} from 'src/exceptions';

// 将可读流转换为字符串
function streamToString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    stream.on('data', (chunk) => (data += chunk));
    stream.on('end', () => resolve(data));
    stream.on('error', (error) => reject(error));
  });
}

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

    try {
      const response = await openai.createChatCompletion(
        {
          ...body.config,
          stream: true,
          messages: body.messages,
        },
        { responseType: 'stream' },
      );
      return response.data as unknown as IncomingMessage;
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const dataString = await streamToString(data);
        // 清除敏感信息
        const cleanDataString = dataString.replace(apiKey, '*********');
        if (error.response.headers['content-type'] === 'application/json') {
          if (cleanDataString.includes('Insufficient balance')) {
            throw new InsufficientBalanceException();
          } else if (status === 401) {
            throw new AccountBannedException();
          }
          const dataObject = JSON.parse(cleanDataString);
          if (dataObject.error.message) {
            throw new Error(`[外部错误] ${dataObject.error.message}`);
          }
        }
        throw new Error(`[外部错误] ${status} ${cleanDataString}`);
      }
    }
  }
}
