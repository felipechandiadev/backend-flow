export declare class SaleLineDto {
    productVariantId: string;
    quantity: number;
    unitPrice: number;
    discountAmount?: number;
    taxId?: string;
    taxRate?: number;
    taxAmount?: number;
    notes?: string;
    unitCost?: number;
}
export declare class PaymentDetailDto {
    paymentMethod: string;
    amount: number;
    bankAccountId?: string;
}
export declare class CreateSaleDto {
    userName: string;
    pointOfSaleId: string;
    cashSessionId: string;
    paymentMethod: string;
    lines: SaleLineDto[];
    payments?: PaymentDetailDto[];
    amountPaid?: number;
    changeAmount?: number;
    customerId?: string;
    documentNumber?: string;
    externalReference?: string;
    notes?: string;
    storageId?: string;
    bankAccountKey?: string;
    metadata?: any;
}
