import { HealthService } from '../application/health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    check(): {
        status: string;
        timestamp: string;
        service: string;
        version: string;
    };
    checkDatabase(): {
        status: string;
        database: string;
        timestamp: string;
    };
}
