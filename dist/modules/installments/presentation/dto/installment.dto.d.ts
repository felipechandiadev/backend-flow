export declare class GetCarteraByDueDateDto {
    fromDate: string;
    toDate: string;
}
export declare class InstallmentDto {
    id: string;
    saleTransactionId?: string | null;
    installmentNumber: number;
    totalInstallments: number;
    amount: number;
    dueDate: Date;
    amountPaid: number;
    status: string;
    paymentTransactionId?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}
export declare class TransactionCarteraSummaryDto {
    totalInstallments: number;
    totalAmount: number;
    totalPaid: number;
    pendingAmount: number;
    paidInstallments: number;
    pendingInstallments: number;
    status: string;
    installments?: InstallmentDto[];
}
