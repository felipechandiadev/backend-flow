import "reflect-metadata";
import { Transaction } from '@modules/transactions/domain/transaction.entity';
export declare enum InstallmentStatus {
    PENDING = "PENDING",
    PARTIAL = "PARTIAL",
    PAID = "PAID",
    OVERDUE = "OVERDUE"
}
export declare enum InstallmentSourceType {
    SALE = "SALE",
    PURCHASE = "PURCHASE",
    PAYROLL = "PAYROLL",
    OPERATING_EXPENSE = "OPERATING_EXPENSE",
    OTHER = "OTHER"
}
export declare class Installment {
    id: string;
    sourceType: InstallmentSourceType;
    sourceTransactionId: string;
    saleTransactionId?: string | null;
    saleTransaction: Transaction;
    payeeType?: string;
    payeeId?: string;
    installmentNumber: number;
    totalInstallments: number;
    amount: number;
    dueDate: Date;
    amountPaid: number;
    status: InstallmentStatus;
    paymentTransactionId?: string;
    paymentTransaction?: Transaction;
    metadata?: Record<string, any>;
    createdAt: Date;
    getPendingAmount(): number;
    isOverdue(today?: Date): boolean;
    getDaysOverdue(today?: Date): number;
}
