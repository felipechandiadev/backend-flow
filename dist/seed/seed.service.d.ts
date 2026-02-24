import { DataSource } from 'typeorm';
export declare class SeedService {
    private readonly dataSource;
    private readonly logger;
    constructor(dataSource: DataSource);
    seedFlowStore(): Promise<void>;
    private cleanCorruptData;
    private verifyConnection;
    private resetDatabase;
    private createSeedData;
    private readSeedJson;
    private hashPassword;
    private parseEnum;
    private ensureArray;
    private buildPersonDisplayName;
}
