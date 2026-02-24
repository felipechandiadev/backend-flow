import { Repository, DataSource } from 'typeorm';
import { TreasuryAccount } from '@modules/treasury-accounts/domain/treasury-account.entity';
import { CashSession, CashSessionStatus } from '@modules/cash-sessions/domain/cash-session.entity';
import { PointOfSale } from '@modules/points-of-sale/domain/point-of-sale.entity';
import { User } from '@modules/users/domain/user.entity';
import { Transaction, TransactionType, TransactionStatus, PaymentMethod } from '@modules/transactions/domain/transaction.entity';
import { TransactionLine } from '@modules/transaction-lines/domain/transaction-line.entity';
import { ProductVariant } from '@modules/product-variants/domain/product-variant.entity';
import { GetCashSessionsDto } from './dto/get-cash-sessions.dto';
import { OpenCashSessionDto } from './dto/open-cash-session.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class CashSessionsService {
    private readonly cashSessionRepository;
    private readonly pointOfSaleRepository;
    private readonly userRepository;
    private readonly transactionRepository;
    private readonly transactionLineRepository;
    private readonly productVariantRepository;
    private readonly dataSource;
    private readonly treasuryAccountRepository;
    constructor(cashSessionRepository: Repository<CashSession>, pointOfSaleRepository: Repository<PointOfSale>, userRepository: Repository<User>, transactionRepository: Repository<Transaction>, transactionLineRepository: Repository<TransactionLine>, productVariantRepository: Repository<ProductVariant>, dataSource: DataSource, treasuryAccountRepository: Repository<TreasuryAccount>);
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        cashSession?: undefined;
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
        message?: undefined;
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
        suggestedOpeningAmount: number;
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
            type: TransactionType;
            amount: number;
            paymentMethod: PaymentMethod;
            status: TransactionStatus;
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
    findAll(query: GetCashSessionsDto): Promise<{
        success: boolean;
        total: number;
        items: {
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
    createSale(createSaleDto: CreateSaleDto): Promise<{
        success: boolean;
        transaction: {
            id: string;
            documentNumber: string;
            type: TransactionType;
            status: TransactionStatus;
            total: number;
            paymentMethod: PaymentMethod;
            createdAt: Date;
        };
        lines: {
            id: string;
            productVariantId: string | undefined;
            quantity: number;
            unitPrice: number;
            total: number;
        }[];
    }>;
    private parsePaymentMethod;
    private generateDocumentNumber;
    registerOpeningTransaction(dto: any): Promise<{
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
        transaction: {
            id: string;
            documentNumber: string;
            createdAt: Date;
            total: number;
        };
    }>;
    registerCashDeposit(input: any): Promise<{
        success: boolean;
        transaction: {
            id: string;
            documentNumber: string;
            createdAt: Date;
            total: number;
        };
        expectedAmount: number;
    }>;
    registerCashWithdrawal(input: any): Promise<{
        success: boolean;
        transaction: {
            id: string;
            documentNumber: string;
            createdAt: Date;
            total: number;
        };
        expectedAmount: number;
    }>;
    closeCashSession(input: any): Promise<{
        success: boolean;
        session: {
            id: string;
            status: CashSessionStatus.CLOSED;
            pointOfSaleId: string | undefined;
            openedById: string | null;
            openedAt: Date;
            openingAmount: number;
            expectedAmount: number;
            closingAmount: number;
            difference: number;
            closedAt: Date;
            notes: string | null;
            closingDetails: import("@modules/cash-sessions/domain/cash-session.entity").CashSessionClosingDetails;
        };
        closing: {
            actual: {
                cash: number;
            };
            expected: {
                cash: number;
            };
            difference: {
                cash: number;
                total: number;
            };
        };
    }>;
    private recomputeCashSessionExpectedAmount;
}
