import { AuditsService } from '../application/audits.service';
import { SearchAuditsDto } from '../application/dto/search-audits.dto';
export declare class AuditsController {
    private readonly auditsService;
    constructor(auditsService: AuditsService);
    search(query: SearchAuditsDto): Promise<{
        success: boolean;
        data: import("../domain/audit.entity").Audit[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("../domain/audit.entity").Audit | null;
    }>;
}
