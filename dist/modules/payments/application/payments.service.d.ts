import { Repository, DataSource } from 'typeorm';
import { Transaction } from '@modules/transactions/domain/transaction.entity';
import { CashSession } from '@modules/cash-sessions/domain/cash-session.entity';
import { Branch } from '@modules/branches/domain/branch.entity';
import { TransactionsService } from '@modules/transactions/application/transactions.service';
import { LedgerEntriesService } from '@modules/ledger-entries/application/ledger-entries.service';
import { CreateMultiplePaymentsDto } from './dto/create-multiple-payments.dto';
import { InstallmentService } from '@modules/installments/application/services/installment.service';
export declare class PaymentsService {
    private readonly transactionRepository;
    private readonly cashSessionRepository;
    private readonly branchRepository;
    private readonly dataSource;
    private readonly transactionsService;
    private readonly ledgerEntriesService;
    private readonly installmentService;
    constructor(transactionRepository: Repository<Transaction>, cashSessionRepository: Repository<CashSession>, branchRepository: Repository<Branch>, dataSource: DataSource, transactionsService: TransactionsService, ledgerEntriesService: LedgerEntriesService, installmentService: InstallmentService);
    createMultiplePayments(dto: CreateMultiplePaymentsDto): Promise<{
        success: boolean;
        payments: any[];
        totalPaid: number;
        change: number;
    }>;
    payQuota(dto: any): Promise<{
        success: boolean;
        message: string;
        transaction: Transaction;
    }>;
    private createPaymentTransactionCentralized;
    private generatePaymentDocumentNumber;
    private recomputeCashSessionExpectedAmount;
}
