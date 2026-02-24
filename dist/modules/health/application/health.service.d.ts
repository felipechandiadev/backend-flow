export declare class HealthService {
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
