import { Repository } from 'typeorm';
import { Installment, InstallmentStatus, InstallmentSourceType } from '../../../installments/domain/installment.entity';
import { InstallmentRepository } from '../../../installments/infrastructure/installment.repository';
import { PayInstallmentDto } from '../../../installments/presentation/dto/pay-installment.dto';
import { Transaction } from '../../../transactions/domain/transaction.entity';
import { PaymentMethod } from '../../../transactions/domain/transaction.entity';
import { TransactionsService } from '../../../transactions/application/transactions.service';
export declare class InstallmentService {
    private readonly repo;
    private readonly transactionsService;
    private readonly transactionsRepository;
    constructor(repo: InstallmentRepository, transactionsService: TransactionsService, transactionsRepository: Repository<Transaction>);
    getInstallmentsForSale(saleTransactionId: string): Promise<Installment[]>;
    createInstallmentsFromSchedule(transactionId: string, schedule: Array<{
        amount: number;
        dueDate: string | Date;
    }>, options: {
        sourceType: InstallmentSourceType;
        payeeType: string;
        payeeId?: string;
    }): Promise<Installment[]>;
    private resolvePaymentTransactionType;
    createInstallmentsForTransaction(transactionId: string, totalAmount: number, numberOfInstallments: number, firstDueDate: Date, sourceType?: InstallmentSourceType): Promise<Installment[]>;
    createSingleInstallment(transactionId: string, amount: number, dueDate: Date, options: {
        sourceType: InstallmentSourceType;
        payeeType: string;
        payeeId?: string;
        metadata?: Record<string, any>;
    }): Promise<Installment>;
    updateInstallmentFromPayment(installmentId: string, paymentAmount: number, paymentTransactionId: string): Promise<Installment>;
    getInstallmentsByTransaction(transactionId: string): Promise<Installment[]>;
    getTransactionCarteraStatus(transactionId: string): Promise<{
        totalInstallments: number;
        totalAmount: number;
        totalPaid: number;
        pendingAmount: number;
        paidInstallments: number;
        pendingInstallments: number;
        status: string;
        installments: Installment[];
    }>;
    getCarteraByDueDate(fromDate: Date, toDate: Date): Promise<{
        dueDate: Date;
        totalAmount: number;
        totalPaid: number;
        pendingAmount: number;
        installmentsCount: number;
    }[]>;
    getOverdueReport(today?: Date): Promise<{
        totalOverdueInstallments: number;
        totalOverdueAmount: number;
        byDaysRange: {
            '0-10': {
                count: number;
                amount: number;
            };
            '11-30': {
                count: number;
                amount: number;
            };
            '31-60': {
                count: number;
                amount: number;
            };
            '60+': {
                count: number;
                amount: number;
            };
        };
        details: any[];
    }>;
    getAccountsPayable(filters?: {
        sourceType?: InstallmentSourceType | InstallmentSourceType[];
        status?: InstallmentStatus | InstallmentStatus[];
        payeeType?: string;
        fromDate?: Date;
        toDate?: Date;
    }): Promise<Installment[]>;
    getAccountsReceivable(filters?: {
        status?: InstallmentStatus | InstallmentStatus[];
        includePaid?: boolean;
        customerId?: string;
        search?: string;
        fromDate?: Date;
        toDate?: Date;
        page?: number;
        pageSize?: number;
    }): Promise<{
        rows: Installment[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    getInstallmentById(id: string): Promise<Installment | null>;
    getPaymentContext(installmentId: string): Promise<{
        payment: {
            id: string;
            documentNumber: string;
            supplierName: any;
            total: number;
            pendingAmount: number;
            paymentMethod: PaymentMethod;
        };
        supplierAccounts: import("../../../persons/domain/person.entity").PersonBankAccount[];
        companyAccounts: import("../../../persons/domain/person.entity").PersonBankAccount[];
    }>;
    payInstallment(installmentId: string, dto: PayInstallmentDto): Promise<{
        success: boolean;
        transaction: Transaction;
    }>;
    validatePayment(installmentId: string, paymentAmount: number): Promise<boolean>;
}
