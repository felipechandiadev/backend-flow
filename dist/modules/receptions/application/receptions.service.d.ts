import { Repository } from 'typeorm';
import { Reception } from '../domain/reception.entity';
import { ReceptionLine } from '../domain/reception-line.entity';
import { Storage } from '../../storages/domain/storage.entity';
import { Branch } from '../../branches/domain/branch.entity';
import { Company } from '../../companies/domain/company.entity';
import { User } from '../../users/domain/user.entity';
import { ProductVariantsService } from '../../product-variants/application/product-variants.service';
import { TransactionsService } from '../../transactions/application/transactions.service';
export declare class ReceptionsService {
    private readonly receptionRepo;
    private readonly receptionLineRepo;
    private readonly storageRepo;
    private readonly branchRepo;
    private readonly companyRepo;
    private readonly userRepo;
    private readonly transactionsService;
    private readonly variantsService;
    private logger;
    constructor(receptionRepo: Repository<Reception>, receptionLineRepo: Repository<ReceptionLine>, storageRepo: Repository<Storage>, branchRepo: Repository<Branch>, companyRepo: Repository<Company>, userRepo: Repository<User>, transactionsService: TransactionsService, variantsService: ProductVariantsService);
    private enrichReceptionLines;
    private getSupplierDisplayName;
    private getStorageDisplayName;
    private buildLineSnapshot;
    private mapReceptionListItem;
    search(opts?: {
        limit?: number;
        offset?: number;
    }): Promise<{
        rows: any[];
        count: number;
        limit: number;
        offset: number;
    }>;
    getById(id: string): Promise<any>;
    private maybeCreatePurchaseTransaction;
    create(data: any): Promise<{
        success: boolean;
        reception: Reception | null;
        transaction: {
            id: any;
        } | null;
        transactionError: any;
    }>;
    createDirect(data: any): Promise<{
        success: boolean;
        reception: Reception | null;
        transaction: {
            id: any;
        } | null;
        transactionError: any;
    }>;
    createFromPurchaseOrder(data: any): Promise<{
        success: boolean;
        reception: Reception | null;
        transaction: {
            id: any;
        } | null;
        transactionError: any;
    }>;
}
