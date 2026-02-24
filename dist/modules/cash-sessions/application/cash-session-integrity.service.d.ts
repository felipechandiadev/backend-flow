import { Repository } from 'typeorm';
import { CashSession } from '../../cash-sessions/domain/cash-session.entity';
export declare class CashSessionIntegrityService {
    private readonly cashSessionRepository;
    constructor(cashSessionRepository: Repository<CashSession>);
    validateIntegrity(): Promise<{
        valid: boolean;
        anomalies: string[];
        totalSessions: number;
    }>;
    cleanupCorruptSessions(): Promise<{
        deletedCount: number;
    }>;
}
