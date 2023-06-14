import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, { success: boolean; data: T }> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<{ success: boolean; data: T }> {
    return next.handle().pipe(map(data => ({ success: true, data })))
  }
}
