import { Repository } from 'typeorm';
import { User } from '../../users/domain/user.entity';
import { Branch } from '../../branches/domain/branch.entity';
import { TransactionsService } from '../../transactions/application/transactions.service';
export declare class CapitalContributionsService {
    private readonly userRepository;
    private readonly branchRepository;
    private readonly transactionsService;
    constructor(userRepository: Repository<User>, branchRepository: Repository<Branch>, transactionsService: TransactionsService);
    list(): Promise<never[]>;
    findOne(): Promise<null>;
    create(payload: Record<string, unknown>): Promise<{
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
    private asString;
    private buildDocumentNumber;
}
