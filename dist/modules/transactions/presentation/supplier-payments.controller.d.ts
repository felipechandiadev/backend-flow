import { TransactionsService } from '../application/transactions.service';
export declare class SupplierPaymentsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    list(limit?: string, page?: string, includeCancelled?: string, includePaid?: string, supplierId?: string): Promise<{
        rows: import("../domain/transaction.entity").Transaction[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<import("../domain/transaction.entity").Transaction | null>;
    getContext(id: string): Promise<{
        payment: any;
        supplierAccounts: any;
        companyAccounts: any;
        supplier: any;
        branch: any;
    }>;
    create(data: any): Promise<import("../domain/transaction.entity").Transaction>;
    update(id: string, data: any): Promise<void>;
    complete(id: string, data?: any): Promise<import("../domain/transaction.entity").Transaction>;
    delete(id: string): Promise<void>;
}
