import { Repository } from 'typeorm';
import { User } from '@modules/users/domain/user.entity';
import { Branch } from '@modules/branches/domain/branch.entity';
import { TransactionsService } from '@modules/transactions/application/transactions.service';
export declare class CashDepositsService {
    private readonly userRepository;
    private readonly branchRepository;
    private readonly transactionsService;
    constructor(userRepository: Repository<User>, branchRepository: Repository<Branch>, transactionsService: TransactionsService);
    list(): Promise<never[]>;
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
}
