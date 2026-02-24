import "reflect-metadata";
export declare enum TaxType {
    IVA = "IVA",
    EXEMPT = "EXEMPT",
    RETENTION = "RETENTION",
    SPECIFIC = "SPECIFIC"
}
export declare class Tax {
    id: string;
    companyId: string;
    name: string;
    code: string;
    taxType: TaxType;
    rate: number;
    description?: string;
    isDefault: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
