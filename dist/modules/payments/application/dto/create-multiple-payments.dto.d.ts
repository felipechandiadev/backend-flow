import { PaymentMethod } from '@modules/transactions/domain/transaction.entity';
export declare class SubPaymentDto {
    id?: string;
    amount: number;
    dueDate: string;
}
export declare class PaymentItemDto {
    paymentMethod: PaymentMethod;
    amount: number;
    bankAccountId?: string;
    subPayments?: SubPaymentDto[];
}
export declare class CreateMultiplePaymentsDto {
    saleTransactionId: string;
    payments: PaymentItemDto[];
}
