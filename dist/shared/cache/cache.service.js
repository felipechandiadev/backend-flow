"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Redis = require("ioredis");
let CacheService = CacheService_1 = class CacheService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(CacheService_1.name);
        this.redisClient = null;
        this.enabled = this.configService.get('REDIS_ENABLED', 'false') === 'true';
    }
    async onModuleInit() {
        if (!this.enabled) {
            this.logger.warn('Redis caching is disabled. Enable with REDIS_ENABLED=true');
            return;
        }
        try {
            this.redisClient = new Redis.default({
                host: this.configService.get('REDIS_HOST', 'localhost'),
                port: this.configService.get('REDIS_PORT', 6379),
                password: this.configService.get('REDIS_PASSWORD'),
                db: this.configService.get('REDIS_DB', 0),
                retryStrategy: (times) => {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                },
                maxRetriesPerRequest: 3,
            });
            this.redisClient.on('connect', () => {
                this.logger.log('Redis connected successfully');
            });
            this.redisClient.on('error', (error) => {
                this.logger.error(`Redis connection error: ${error.message}`);
            });
            await this.redisClient.ping();
            this.logger.log('Redis cache service initialized');
        }
        catch (error) {
            this.logger.error(`Failed to initialize Redis: ${error.message}. Caching disabled.`);
            this.redisClient = null;
        }
    }
    async onModuleDestroy() {
        if (this.redisClient) {
            await this.redisClient.quit();
            this.logger.log('Redis connection closed');
        }
    }
    async get(key) {
        if (!this.redisClient) {
            return null;
        }
        try {
            const value = await this.redisClient.get(key);
            if (!value) {
                return null;
            }
            return JSON.parse(value);
        }
        catch (error) {
            this.logger.error(`Cache get error for key ${key}: ${error.message}`);
            return null;
        }
    }
    async set(key, value, ttlSeconds) {
        if (!this.redisClient) {
            return;
        }
        try {
            const serialized = JSON.stringify(value);
            if (ttlSeconds) {
                await this.redisClient.setex(key, ttlSeconds, serialized);
            }
            else {
                await this.redisClient.set(key, serialized);
            }
            this.logger.debug(`Cached key: ${key} (TTL: ${ttlSeconds || 'none'}s)`);
        }
        catch (error) {
            this.logger.error(`Cache set error for key ${key}: ${error.message}`);
        }
    }
    async del(key) {
        if (!this.redisClient) {
            return;
        }
        try {
            await this.redisClient.del(key);
            this.logger.debug(`Deleted cache key: ${key}`);
        }
        catch (error) {
            this.logger.error(`Cache delete error for key ${key}: ${error.message}`);
        }
    }
    async delPattern(pattern) {
        if (!this.redisClient) {
            return;
        }
        try {
            const keys = await this.redisClient.keys(pattern);
            if (keys.length > 0) {
                await this.redisClient.del(...keys);
                this.logger.log(`Deleted ${keys.length} cache keys matching pattern: ${pattern}`);
            }
        }
        catch (error) {
            this.logger.error(`Cache delete pattern error for ${pattern}: ${error.message}`);
        }
    }
    async cacheBalanceSheet(companyId, periodId, generator) {
        const key = `balance_sheet:${companyId}:${periodId}`;
        const cached = await this.get(key);
        if (cached) {
            this.logger.debug(`Balance sheet cache HIT: ${key}`);
            return cached;
        }
        this.logger.debug(`Balance sheet cache MISS: ${key}`);
        const result = await generator();
        const ttl = 24 * 60 * 60;
        await this.set(key, result, ttl);
        return result;
    }
    async invalidateCompanyCache(companyId) {
        await this.delPattern(`*:${companyId}:*`);
        this.logger.log(`Invalidated all cache for company ${companyId}`);
    }
    async invalidatePeriodCache(periodId) {
        await this.delPattern(`*:${periodId}:*`);
        await this.delPattern(`*:${periodId}`);
        this.logger.log(`Invalidated all cache for period ${periodId}`);
    }
    async getStats() {
        if (!this.redisClient) {
            return { enabled: false };
        }
        try {
            const info = await this.redisClient.info('stats');
            return { enabled: true, info };
        }
        catch (error) {
            this.logger.error(`Failed to get cache stats: ${error.message}`);
            return { enabled: false };
        }
    }
    async flushAll() {
        if (!this.redisClient) {
            return;
        }
        try {
            await this.redisClient.flushdb();
            this.logger.warn('Flushed all cache data');
        }
        catch (error) {
            this.logger.error(`Failed to flush cache: ${error.message}`);
        }
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = CacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CacheService);
//# sourceMappingURL=cache.service.js.map