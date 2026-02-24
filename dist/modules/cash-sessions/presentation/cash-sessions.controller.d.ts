import { CashSessionsService } from '../application/cash-sessions.service';
import { CashSessionIntegrityService } from '../application/cash-session-integrity.service';
import { CashSessionCoreService } from '../application/cash-session-core.service';
import { SalesFromSessionService } from '../application/sales-from-session.service';
import { OpeningTransactionDto } from '../application/dto/opening-transaction.dto';
import { GetCashSessionsDto } from '../application/dto/get-cash-sessions.dto';
import { OpenCashSessionDto } from '../application/dto/open-cash-session.dto';
import { CreateSaleDto } from '../application/dto/create-sale.dto';
export declare class CashSessionsController {
    private readonly coreService;
    private readonly salesService;
    private readonly cashSessionsService;
    private readonly integrityService;
    constructor(coreService: CashSessionCoreService, salesService: SalesFromSessionService, cashSessionsService: CashSessionsService, integrityService: CashSessionIntegrityService);
    findAll(query: GetCashSessionsDto): Promise<{
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
    open(openDto: OpenCashSessionDto): Promise<{
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
    getSales(id: string): Promise<{
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
    createSale(createSaleDto: CreateSaleDto): Promise<{
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
    registerOpeningTransaction(dto: OpeningTransactionDto): Promise<{
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
        transaction: {
            id: string;
            documentNumber: string;
            createdAt: Date;
            total: number;
        };
    }>;
    registerCashDeposit(dto: any): Promise<{
        success: boolean;
        transaction: {
            id: string;
            documentNumber: string;
            createdAt: Date;
            total: number;
        };
        expectedAmount: number;
    }>;
    registerCashWithdrawal(dto: any): Promise<{
        success: boolean;
        transaction: {
            id: string;
            documentNumber: string;
            createdAt: Date;
            total: number;
        };
        expectedAmount: number;
    }>;
    close(dto: any): Promise<{
        success: boolean;
        message: string;
        sessionId: string;
        closingTransactionId: string | null;
        expectedAmount: number;
    }>;
    checkIntegrity(): Promise<{
        valid: boolean;
        anomalies: string[];
        totalSessions: number;
    }>;
    cleanupIntegrity(): Promise<{
        deletedCount: number;
    }>;
}
