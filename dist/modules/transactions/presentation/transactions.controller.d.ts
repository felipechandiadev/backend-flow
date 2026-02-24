import { TransactionsService } from '../application/transactions.service';
import { SearchTransactionsDto } from '../application/dto/search-transactions.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    search(query: SearchTransactionsDto): Promise<{
        data: import("../domain/transaction.entity").Transaction[];
        total: number;
        page: number;
        limit: number;
    }>;
    listJournal(page?: string, pageSize?: string, limit?: string, filters?: string, type?: string, status?: string, dateFrom?: string, dateTo?: string, search?: string): Promise<{
        rows: any;
        total: any;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("../domain/transaction.entity").Transaction | null>;
}
