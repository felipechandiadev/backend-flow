import { AnalyticsService, DashboardStats } from '../application/analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    dashboard(): Promise<DashboardStats>;
    report(): Promise<DashboardStats>;
}
