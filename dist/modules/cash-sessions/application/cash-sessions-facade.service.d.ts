import { CashSessionCoreService } from './cash-session-core.service';
import { SalesFromSessionService } from './sales-from-session.service';
import { SessionInventoryService } from './session-inventory.service';
export declare class CashSessionsServiceFacade {
    private readonly coreService;
    private readonly salesService;
    private readonly inventoryService;
    private readonly logger;
    constructor(coreService: CashSessionCoreService, salesService: SalesFromSessionService, inventoryService: SessionInventoryService);
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        cashSession?: undefined;
        movements?: undefined;
    } | {
        success: boolean;
        cashSession: {
            openedBy: {
                id: string;
                userName: string;
                person: {
                    firstName: string;
                    lastName: string | undefined;
                } | null;
            } | null;
            closedBy: {
                id: string;
                userName: string;
                person: {
                    firstName: string;
                    lastName: string | undefined;
                } | null;
            } | null;
            id: string;
            pointOfSaleId?: string;
            openedById?: string;
            closedById?: string;
            status: import("../domain/cash-session.entity").CashSessionStatus;
            openingAmount: number;
            closingAmount?: number;
            expectedAmount?: number;
            difference?: number;
            openedAt: Date;
            closedAt?: Date;
            notes?: string;
            closingDetails?: import("../domain/cash-session.entity").CashSessionClosingDetails | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt?: Date;
            pointOfSale?: import("../../points-of-sale/domain/point-of-sale.entity").PointOfSale;
        };
        movements: {
            id: string;
            transactionType: import("../../transactions/domain/transaction.entity").TransactionType;
            documentNumber?: string;
            createdAt?: Date;
            total: number;
            paymentMethod?: import("../../transactions/domain/transaction.entity").PaymentMethod;
            paymentMethodLabel?: string;
            userId?: string;
            userFullName?: string;
            userUserName?: string;
            notes?: string;
            reason?: string;
            metadata?: any;
            direction: "IN" | "OUT" | "NEUTRAL";
        }[];
        message?: undefined;
    }>;
    findAll(query: any): Promise<{
        success: boolean;
        total: number;
        items: {
            pointOfSaleName: string | null;
            branchName: string | null;
            openedByUserName: string | null;
            openedByFullName: string | null;
            closedByUserName: string | null;
            closedByFullName: string | null;
            id: string;
            pointOfSaleId?: string;
            openedById?: string;
            closedById?: string;
            status: import("../domain/cash-session.entity").CashSessionStatus;
            openingAmount: number;
            closingAmount?: number;
            expectedAmount?: number;
            difference?: number;
            openedAt: Date;
            closedAt?: Date;
            notes?: string;
            closingDetails?: import("../domain/cash-session.entity").CashSessionClosingDetails | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt?: Date;
            pointOfSale?: import("../../points-of-sale/domain/point-of-sale.entity").PointOfSale;
            openedBy?: import("../../users/domain/user.entity").User;
            closedBy?: import("../../users/domain/user.entity").User;
        }[];
    }>;
    open(openDto: any): Promise<{
        success: boolean;
        cashSession: {
            id: string;
            pointOfSaleId: string | undefined;
            openedById: string | undefined;
            status: import("../domain/cash-session.entity").CashSessionStatus;
            openingAmount: number;
            openedAt: Date;
            createdAt: Date;
            updatedAt: Date;
            expectedAmount: number | null;
            closingAmount: number | null;
            closedAt: Date | null;
            difference: number | null;
            notes: string | null;
            closingDetails: import("../domain/cash-session.entity").CashSessionClosingDetails | null;
            openedBy: {
                id: string;
                userName: string;
                person: {
                    id: string;
                    firstName: string;
                    lastName: string | undefined;
                } | null;
            } | null;
        };
        pointOfSale: {
            id: string;
            name: string;
            deviceId: string | null;
            branchId: string | null;
            branchName: string | null;
            priceLists: {
                id: string;
                name: string;
                isActive: boolean;
            }[];
        };
    }>;
    getSales(cashSessionId: string): Promise<{
        success: boolean;
        cashSessionId: string;
        totalSales: number;
        sales: {
            id: string;
            type: import("../../transactions/domain/transaction.entity").TransactionType;
            amount: number;
            paymentMethod: import("../../transactions/domain/transaction.entity").PaymentMethod;
            status: import("../../transactions/domain/transaction.entity").TransactionStatus;
            createdAt: Date;
            documentNumber: string;
            externalReference: string | undefined;
            notes: string | undefined;
            lines: {
                id: string;
                productVariantId: string | undefined;
                productName: string;
                variantName: undefined;
                quantity: number;
                unitPrice: number;
                discountAmount: number;
                taxAmount: number;
                totalAmount: number;
            }[];
        }[];
    }>;
    createSale(createSaleDto: any): Promise<{
        success: boolean;
        transaction: {
            id: string;
            documentNumber: string;
            transactionType: import("../../transactions/domain/transaction.entity").TransactionType;
            total: number;
            status: import("../../transactions/domain/transaction.entity").TransactionStatus;
            createdAt: Date;
            paymentMethod: import("../../transactions/domain/transaction.entity").PaymentMethod;
            lines: Partial<import("../../transaction-lines/domain/transaction-line.entity").TransactionLine>[];
        };
        lines: Partial<import("../../transaction-lines/domain/transaction-line.entity").TransactionLine>[];
    }>;
    registerOpeningTransaction(dto: any): Promise<{
        success: boolean;
        error: string;
    }>;
    registerCashDeposit(dto: any): Promise<{
        success: boolean;
        error: string;
    }>;
    registerCashWithdrawal(dto: any): Promise<{
        success: boolean;
        error: string;
    }>;
    closeCashSession(dto: any): Promise<{
        success: boolean;
        message: string;
        sessionId: string;
        closingTransactionId: string | null;
        expectedAmount: number;
    }>;
    addLineItem(saleId: string, lineItem: any): Promise<{
        success: boolean;
        error: string;
    }>;
    updateLineItem(saleId: string, lineItemId: string, updates: any): Promise<{
        success: boolean;
        error: string;
    }>;
    deleteLineItem(saleId: string, lineItemId: string): Promise<{
        success: boolean;
        error: string;
    }>;
    reconcile(sessionId: string, physicalAmount: number): Promise<{
        success: boolean;
        error: string;
    }>;
    getInventoryAllocations(sessionId: string): Promise<{
        success: boolean;
        error: string;
    }>;
}
