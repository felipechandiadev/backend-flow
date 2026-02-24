import { Repository, DataSource } from 'typeorm';
import { CashSession, CashSessionStatus } from '@modules/cash-sessions/domain/cash-session.entity';
import { PointOfSale } from '@modules/points-of-sale/domain/point-of-sale.entity';
import { User } from '@modules/users/domain/user.entity';
import { OpenCashSessionDto } from './dto/open-cash-session.dto';
import { GetCashSessionsDto } from './dto/get-cash-sessions.dto';
import { TransactionsService } from '@modules/transactions/application/transactions.service';
import { TransactionType, PaymentMethod } from '@modules/transactions/domain/transaction.entity';
export declare class CashSessionCoreService {
    private readonly cashSessionRepository;
    private readonly pointOfSaleRepository;
    private readonly userRepository;
    private readonly dataSource;
    private readonly transactionsService;
    private readonly logger;
    constructor(cashSessionRepository: Repository<CashSession>, pointOfSaleRepository: Repository<PointOfSale>, userRepository: Repository<User>, dataSource: DataSource, transactionsService: TransactionsService);
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
            status: CashSessionStatus;
            openingAmount: number;
            closingAmount?: number;
            expectedAmount?: number;
            difference?: number;
            openedAt: Date;
            closedAt?: Date;
            notes?: string;
            closingDetails?: import("@modules/cash-sessions/domain/cash-session.entity").CashSessionClosingDetails | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt?: Date;
            pointOfSale?: PointOfSale;
        };
        movements: {
            id: string;
            transactionType: TransactionType;
            documentNumber?: string;
            createdAt?: Date;
            total: number;
            paymentMethod?: PaymentMethod;
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
            status: CashSessionStatus;
            openingAmount: number;
            closingAmount?: number;
            expectedAmount?: number;
            difference?: number;
            openedAt: Date;
            closedAt?: Date;
            notes?: string;
            closingDetails?: import("@modules/cash-sessions/domain/cash-session.entity").CashSessionClosingDetails | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt?: Date;
            pointOfSale?: PointOfSale;
            openedBy?: User;
            closedBy?: User;
        }[];
    }>;
    open(openDto: OpenCashSessionDto): Promise<{
        success: boolean;
        cashSession: {
            id: string;
            pointOfSaleId: string | undefined;
            openedById: string | undefined;
            status: CashSessionStatus;
            openingAmount: number;
            openedAt: Date;
            createdAt: Date;
            updatedAt: Date;
            expectedAmount: number | null;
            closingAmount: number | null;
            closedAt: Date | null;
            difference: number | null;
            notes: string | null;
            closingDetails: import("@modules/cash-sessions/domain/cash-session.entity").CashSessionClosingDetails | null;
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
    closeByUserName(sessionId: string, userName: string): Promise<{
        success: boolean;
        message: string;
        sessionId: string;
        closingTransactionId: string | null;
        expectedAmount: number;
    }>;
    close(sessionId: string, userId: string): Promise<{
        success: boolean;
        message: string;
        sessionId: string;
        closingTransactionId: string | null;
        expectedAmount: number;
    }>;
    reconcile(sessionId: string, physicalAmount: number): Promise<{
        success: boolean;
        reconciliation: {
            sessionId: string;
            expectedAmount: number;
            physicalAmount: number;
            discrepancy: number;
            requiresAdjustment: boolean;
        };
    }>;
    getStats(sessionId: string): Promise<{
        success: boolean;
        stats: {
            sessionId: string;
            openedAt: Date;
            closedAt: Date | undefined;
            status: CashSessionStatus;
            expectedAmount: number | undefined;
            closingAmount: number | undefined;
            difference: number | undefined;
        };
    }>;
}
