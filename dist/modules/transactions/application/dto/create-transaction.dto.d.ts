import { TransactionType, PaymentMethod, PaymentStatus } from '@modules/transactions/domain/transaction.entity';
export declare class CreateTransactionLineDto {
    productId?: string;
    productVariantId?: string;
    unitId?: string;
    productName: string;
    productSku?: string;
    variantName?: string;
    quantity: number;
    unitPrice: number;
    unitCost?: number;
    discountPercentage: number;
    discountAmount: number;
    taxId?: string;
    taxRate: number;
    taxAmount: number;
    subtotal: number;
    total: number;
    notes?: string;
}
export declare class CreateTransactionDto {
    transactionType: TransactionType;
    branchId: string;
    userId: string;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
    paymentMethod: PaymentMethod;
    paymentStatus?: PaymentStatus;
    amountPaid: number;
    changeAmount?: number;
    customerId?: string;
    supplierId?: string;
    shareholderId?: string;
    employeeId?: string;
    pointOfSaleId?: string;
    cashSessionId?: string;
    storageId?: string;
    targetStorageId?: string;
    expenseCategoryId?: string;
    resultCenterId?: string;
    accountingPeriodId?: string;
    documentType?: string;
    documentFolio?: string;
    paymentDueDate?: string;
    relatedTransactionId?: string;
    externalReference?: string;
    bankAccountKey?: string;
    notes?: string;
    lines?: CreateTransactionLineDto[];
    metadata?: Record<string, any>;
    validate(): string[];
}
export declare class CreateCapitalContributionDto {
    shareholderId: string;
    bankAccountKey: string;
    amount: number;
    notes?: string;
    occurredOn?: string;
    toCreateTransactionDto(userId: string, branchId: string): CreateTransactionDto;
}
export declare class CreateCashDepositDto {
    bankAccountKey: string;
    amount: number;
    notes?: string;
    occurredOn?: string;
    toCreateTransactionDto(userId: string, branchId: string): CreateTransactionDto;
}
export declare class CreateBankTransferDto {
    bankAccountKey: string;
    amount: number;
    notes?: string;
    occurredOn?: string;
    toCreateTransactionDto(userId: string, branchId: string): CreateTransactionDto;
}
export declare class CreateBankWithdrawalToShareholderDto {
    shareholderId: string;
    bankAccountKey: string;
    amount: number;
    notes?: string;
    occurredOn?: string;
    toCreateTransactionDto(userId: string, branchId: string): CreateTransactionDto;
}
