import { Repository, DataSource } from 'typeorm';
import { Transaction, TransactionType, TransactionStatus, PaymentMethod } from '../../transactions/domain/transaction.entity';
import { TransactionLine } from '../../transaction-lines/domain/transaction-line.entity';
import { CashSession } from '../../cash-sessions/domain/cash-session.entity';
import { PointOfSale } from '../../points-of-sale/domain/point-of-sale.entity';
import { User } from '../../users/domain/user.entity';
import { ProductVariant } from '../../product-variants/domain/product-variant.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { TransactionsService } from '../../transactions/application/transactions.service';
export declare class SalesFromSessionService {
    private readonly transactionRepository;
    private readonly transactionLineRepository;
    private readonly cashSessionRepository;
    private readonly pointOfSaleRepository;
    private readonly userRepository;
    private readonly productVariantRepository;
    private readonly dataSource;
    private readonly transactionsService;
    constructor(transactionRepository: Repository<Transaction>, transactionLineRepository: Repository<TransactionLine>, cashSessionRepository: Repository<CashSession>, pointOfSaleRepository: Repository<PointOfSale>, userRepository: Repository<User>, productVariantRepository: Repository<ProductVariant>, dataSource: DataSource, transactionsService: TransactionsService);
    getSalesForSession(cashSessionId: string): Promise<{
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
    createSale(createSaleDto: CreateSaleDto): Promise<{
        success: boolean;
        transaction: {
            id: string;
            documentNumber: string;
            transactionType: TransactionType;
            total: number;
            status: TransactionStatus;
            createdAt: Date;
            paymentMethod: PaymentMethod;
            lines: Partial<TransactionLine>[];
        };
        lines: Partial<TransactionLine>[];
    }>;
    addLineItem(saleId: string, lineItem: any): Promise<void>;
    updateLineItem(saleId: string, lineItemId: string, updates: any): Promise<void>;
    deleteLineItem(saleId: string, lineItemId: string): Promise<void>;
    private generateTempDocumentNumber;
}
