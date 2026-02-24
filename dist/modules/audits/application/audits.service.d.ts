import { Repository } from 'typeorm';
import { Audit } from '../domain/audit.entity';
import { SearchAuditsDto } from './dto/search-audits.dto';
export declare class AuditsService {
    private readonly auditRepository;
    constructor(auditRepository: Repository<Audit>);
    search(dto: SearchAuditsDto): Promise<{
        success: boolean;
        data: Audit[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: Audit | null;
    }>;
}
