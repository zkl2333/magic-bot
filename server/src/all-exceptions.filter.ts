import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const message =
      exception instanceof Error ? exception.message : '未知错误，请联系管理员';

    const errorResponse: any = {
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    };

    if (exception instanceof HttpException) {
      errorResponse.error = exception.getResponse();
    }

    if (status === 500) {
      console.error(exception);
    }

    response.status(status).json(errorResponse);
  }
}
