import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class TransactionLoggingInterceptor implements NestInterceptor {
    private logger;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private isTransaction;
}
