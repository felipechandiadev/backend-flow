import "reflect-metadata";
import { PointOfSale } from '@modules/points-of-sale/domain/point-of-sale.entity';
import { User } from '@modules/users/domain/user.entity';
export type CashSessionTenderBreakdown = {
    cash: number;
    debitCard: number;
    creditCard: number;
    transfer: number;
    check: number;
    other: number;
};
export type CashSessionClosingDetails = {
    countedByUserId: string;
    countedByUserName?: string | null;
    countedAt: string;
    notes?: string | null;
    actual: CashSessionTenderBreakdown;
    expected: CashSessionTenderBreakdown;
    difference: {
        cash: number;
        total: number;
    };
};
export declare enum CashSessionStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    RECONCILED = "RECONCILED"
}
export declare class CashSession {
    id: string;
    pointOfSaleId?: string;
    openedById?: string;
    closedById?: string;
    status: CashSessionStatus;
    openingAmount: number;
    closingAmount?: number;
    expectedAmount?: number;
    difference?: number;
    openedAt: Date;
    closedAt?: Date;
    notes?: string;
    closingDetails?: CashSessionClosingDetails | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    pointOfSale?: PointOfSale;
    openedBy?: User;
    closedBy?: User;
}
