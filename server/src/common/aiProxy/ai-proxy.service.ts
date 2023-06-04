import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const sessionId = 'AIP_MANAGE_KEY';
const baseUrl = 'https://aiproxy.io/api';

const api = {
  createApiKey: '/user/createApiKey',
  updateApiKey: '/user/updateApiKey',
  getPointAccount: '/point/getPointAccount',
  listTransaction: '/point/listTransaction',
};

const defaultModelPermission = [
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0301',
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-32k',
  'gpt-4-32k-0314',
  'text-davinci-003',
  'text-davinci-002',
  'text-curie-001',
  'text-babbage-001',
  'text-ada-001',
  'text-embedding-ada-002',
  'text-search-ada-doc-001',
  'whisper-1',
  'text-davinci-edit-001',
  'code-davinci-edit-001',
];

@Injectable()
export class AiProxyService {
  constructor(private prisma: PrismaService) {}

  private printSensitiveLog(message: string, sensitiveData: string) {
    const prefix = sensitiveData.slice(0, 7);
    const suffix = sensitiveData.slice(-7);
    console.log(`${message} ${prefix}****${suffix}`);
  }

  private createUrl(path: string) {
    return `${baseUrl}${path}`;
  }

  async getPointAccount(uid: string) {
    const headers = {
      'content-type': 'application/json',
      cookie: `sessionId=${sessionId}`,
    };

    const response = await fetch(
      this.createUrl(`${api.getPointAccount}?externalId=${uid}`),
      {
        method: 'GET',
        headers,
      },
    );

    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    const responseBody = await response.json();

    if (responseBody.success) {
      return responseBody.data;
    } else {
      console.error(responseBody);
      return null;
    }
  }

  async createApiKey(userId: string) {
    const headers = {
      'content-type': 'application/json',
      cookie: `sessionId=${sessionId}`,
    };

    const data = {
      name: `web-user-${userId.slice(0, 7)}`,
      externalId: userId,
      enableSubPointAccount: true,
      initPoint: '1000.00',
      modelPermission: defaultModelPermission,
    };

    const response = await fetch(this.createUrl(api.createApiKey), {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    const responseBody = await response.json();

    if (!responseBody.success) {
      console.error('createApiKey error', responseBody);
      throw new Error(responseBody.message);
    }

    return responseBody.data;
  }

  async listApiKey() {
    const headers = {
      'content-type': 'application/json',
      cookie: `sessionId=${sessionId}`,
    };

    const response = await fetch(this.createUrl('/user/listApiKey'), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      console.error(
        `listApiKey Request failed with status code ${response.status}`,
      );
      return [];
    }

    const responseBody = await response.json();

    if (!responseBody.success) {
      console.error('listApiKey error', responseBody);
      return [];
    }

    return responseBody.data;
  }

  async fetchApiKey(userId: string) {
    const createUserPlatformAndLog = async (apiKey: string) => {
      const newUserPlatform = await this.prisma.userPlatform.create({
        data: {
          platform: 'AI Proxy',
          apiKey: apiKey,
          user: {
            connect: { id: userId },
          },
        },
      });

      this.printSensitiveLog('AI密钥关联成功', newUserPlatform.apiKey);
      return newUserPlatform.apiKey;
    };

    const existingAIKey = await this.prisma.userPlatform.findFirst({
      where: {
        userId: userId,
        platform: 'AI Proxy',
      },
    });

    if (existingAIKey) {
      return existingAIKey.apiKey;
    }

    const allApiKeys = await this.listApiKey();
    const matchingApiKey = allApiKeys.find(
      (key: any) => key.externalId === userId,
    );

    if (matchingApiKey) {
      this.printSensitiveLog('找到关联的 AI密钥', matchingApiKey.apiKey);
      return createUserPlatformAndLog(matchingApiKey.apiKey);
    }

    const newApiKey = await this.createApiKey(userId);
    this.printSensitiveLog('创建AI密钥', newApiKey);
    return createUserPlatformAndLog(newApiKey);
  }

  async listTransaction(uid: string, page: number) {
    const { subKey } = await this.getPointAccount(uid);

    const headers = {
      'content-type': 'application/json',
      cookie: `sessionId=${sessionId}`,
    };

    const response = await fetch(this.createUrl(api.listTransaction), {
      method: 'POST',
      headers,
      body: JSON.stringify({
        order: 'desc',
        orderBy: 'gmtCreate',
        page: page,
        pageSize: 10,
        subKey: subKey,
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    const responseBody = await response.json();

    if (!responseBody.success) {
      console.error('listTransaction error', responseBody);
      throw new Error(responseBody.message);
    }

    return responseBody.data;
  }

  async addKeyPoints(uid: string, addPoints: number) {
    const allApiKeys = await this.listApiKey();
    const matchingApiKey = allApiKeys.find(
      (key: any) => key.externalId === uid,
    );

    const newPoints = matchingApiKey.currentPoints + addPoints;

    const headers = {
      'content-type': 'application/json',
      cookie: `sessionId=${sessionId}`,
    };

    console.log('updateKeyPoints', matchingApiKey, newPoints);

    const response = await fetch(this.createUrl(api.updateApiKey), {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...matchingApiKey,
        initPoint: newPoints,
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    const responseBody = await response.json();

    if (!responseBody.success) {
      console.error('updateKeyPoints error', responseBody);
      throw new Error(responseBody.message);
    }

    return responseBody.data;
  }
}
