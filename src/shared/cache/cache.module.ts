import { Module, Global } from '@nestjs/common';
import { CacheService } from './cache.service';

/**
 * PHASE 5: Cache Module
 * 
 * Global module that provides Redis caching throughout the application.
 * Marked as @Global() so it's available everywhere without explicit imports.
 */
@Global()
@Module({
    providers: [CacheService],
    exports: [CacheService],
})
export class CacheModule {}
