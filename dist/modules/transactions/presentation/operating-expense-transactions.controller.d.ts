import { TransactionsService } from '../application/transactions.service';
export declare class OperatingExpenseTransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(data: any, req: any): Promise<import("../domain/transaction.entity").Transaction>;
}
