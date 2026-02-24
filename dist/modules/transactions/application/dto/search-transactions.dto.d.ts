import { PaymentMethod, TransactionStatus, TransactionType } from '@modules/transactions/domain/transaction.entity';
export declare class SearchTransactionsDto {
    page?: number;
    limit?: number;
    pageSize?: number;
    filters?: any;
    type?: TransactionType;
    status?: TransactionStatus;
    paymentMethod?: PaymentMethod;
    branchId?: string;
    pointOfSaleId?: string;
    customerId?: string;
    supplierId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
}
