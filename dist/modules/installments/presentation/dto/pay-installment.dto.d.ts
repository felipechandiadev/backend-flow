import { PaymentMethod } from '@modules/transactions/domain/transaction.entity';
export declare class PayInstallmentDto {
    paymentMethod: PaymentMethod;
    companyAccountKey?: string;
    note?: string;
    amount?: number;
}
