import { InstallmentService } from '@modules/installments/application/services/installment.service';
import { CreateInstallmentDto } from '@modules/installments/presentation/dto/create-installment.dto';
import { TransactionCarteraSummaryDto } from '@modules/installments/presentation/dto/installment.dto';
import { PayInstallmentDto } from '@modules/installments/presentation/dto/pay-installment.dto';
export declare class InstallmentController {
    private readonly installmentService;
    constructor(installmentService: InstallmentService);
    getAccountsPayable(sourceType?: string, status?: string, payeeType?: string, fromDate?: string, toDate?: string): Promise<{
        id: any;
        sourceType: any;
        sourceTransactionId: any;
        payeeType: any;
        payeeId: any;
        payeeName: any;
        installmentNumber: any;
        totalInstallments: any;
        fromReceptionNumber: any;
        amount: any;
        amountPaid: any;
        pendingAmount: any;
        dueDate: any;
        status: any;
        isOverdue: any;
        daysOverdue: any;
        paymentTransactionId: any;
        metadata: any;
        createdAt: any;
    }[]>;
    getInstallmentsByTransaction(transactionId: string): Promise<import("../domain/installment.entity").Installment[]>;
    getTransactionCarteraStatus(transactionId: string): Promise<TransactionCarteraSummaryDto>;
    getInstallmentById(id: string): Promise<import("../domain/installment.entity").Installment | null>;
    getInstallmentPaymentContext(id: string): Promise<{
        payment: {
            id: string;
            documentNumber: string;
            supplierName: any;
            total: number;
            pendingAmount: number;
            paymentMethod: import("../../transactions/domain/transaction.entity").PaymentMethod;
        };
        supplierAccounts: import("../../persons/domain/person.entity").PersonBankAccount[];
        companyAccounts: import("../../persons/domain/person.entity").PersonBankAccount[];
    }>;
    payInstallment(id: string, dto: PayInstallmentDto): Promise<{
        success: boolean;
        transaction: import("../../transactions/domain/transaction.entity").Transaction;
    }>;
    getCarteraByDueDate(fromDate: string, toDate: string): Promise<{
        dueDate: Date;
        totalAmount: number;
        totalPaid: number;
        pendingAmount: number;
        installmentsCount: number;
    }[]>;
    getOverdueReport(today?: string): Promise<{
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
    createInstallments(dto: CreateInstallmentDto): Promise<import("../domain/installment.entity").Installment[]>;
}
