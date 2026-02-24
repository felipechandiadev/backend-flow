import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class CacheService implements OnModuleInit, OnModuleDestroy {
    private readonly configService;
    private readonly logger;
    private redisClient;
    private readonly enabled;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
    delPattern(pattern: string): Promise<void>;
    cacheBalanceSheet(companyId: string, periodId: string, generator: () => Promise<any>): Promise<any>;
    invalidateCompanyCache(companyId: string): Promise<void>;
    invalidatePeriodCache(periodId: string): Promise<void>;
    getStats(): Promise<{
        enabled: boolean;
        info?: any;
    }>;
    flushAll(): Promise<void>;
}
