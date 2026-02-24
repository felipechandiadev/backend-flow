import { EventEmitter2 } from '@nestjs/event-emitter';
import { Repository, DataSource } from 'typeorm';
import { PaymentMethod, Transaction, TransactionType } from '../../transactions/domain/transaction.entity';
import { Branch } from '../../branches/domain/branch.entity';
import { SearchTransactionsDto } from './dto/search-transactions.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { LedgerEntriesService } from '../../ledger-entries/application/ledger-entries.service';
import { AccountingPeriodsService } from '../../accounting-periods/application/accounting-periods.service';
export declare class TransactionsService {
    private readonly transactionsRepository;
    private readonly branchRepository;
    private readonly dataSource;
    private readonly ledgerService;
    private readonly eventEmitter;
    private readonly accountingPeriodsService;
    private logger;
    constructor(transactionsRepository: Repository<Transaction>, branchRepository: Repository<Branch>, dataSource: DataSource, ledgerService: LedgerEntriesService, eventEmitter: EventEmitter2, accountingPeriodsService: AccountingPeriodsService);
    getTotalSalesForSession(cashSessionId: string): Promise<number>;
    getMovementsForSession(cashSessionId: string): Promise<{
        id: string;
        transactionType: TransactionType;
        documentNumber: string;
        createdAt: Date;
        total: number;
        paymentMethod: PaymentMethod;
        paymentMethodLabel: undefined;
        userId: string | null;
        userFullName: string | null;
        userUserName: string | null;
        notes: string | null;
        reason: any;
        metadata: Record<string, any> | null;
        direction: "IN" | "OUT" | "NEUTRAL";
    }[]>;
    private computeDirection;
    createTransaction(dto: CreateTransactionDto): Promise<Transaction>;
    private generateDocumentNumber;
    search(dto: SearchTransactionsDto): Promise<{
        data: Transaction[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<Transaction | null>;
    completePayment(paymentId: string, data: {
        paymentMethod?: string;
        bankAccountKey?: string;
        supplierBankAccount?: any;
        companyBankAccount?: any;
        note?: string;
    }): Promise<Transaction>;
    listJournal(dto: SearchTransactionsDto): Promise<{
        rows: any;
        total: any;
        page: number;
        limit: number;
    }>;
    private translateTransactionType;
    private getAccountType;
}
