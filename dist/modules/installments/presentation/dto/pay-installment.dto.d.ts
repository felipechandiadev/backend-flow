import { PaymentMethod } from '../../../transactions/domain/transaction.entity';
export declare class PayInstallmentDto {
    paymentMethod: PaymentMethod;
    companyAccountKey?: string;
    note?: string;
    amount?: number;
}
