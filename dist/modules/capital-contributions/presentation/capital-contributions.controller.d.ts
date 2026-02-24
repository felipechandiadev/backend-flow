import { CapitalContributionsService } from '../application/capital-contributions.service';
export declare class CapitalContributionsController {
    private readonly capitalContributionsService;
    constructor(capitalContributionsService: CapitalContributionsService);
    list(): Promise<never[]>;
    findOne(_id: string): Promise<null>;
    create(data: Record<string, unknown>): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: {
            id: string;
            documentNumber: string;
            createdAt: Date;
            asientos: any;
        };
        error?: undefined;
    }>;
}
