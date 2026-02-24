"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesFromSessionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_entity_1 = require("../../transactions/domain/transaction.entity");
const transaction_line_entity_1 = require("../../transaction-lines/domain/transaction-line.entity");
const cash_session_entity_1 = require("../domain/cash-session.entity");
const point_of_sale_entity_1 = require("../../points-of-sale/domain/point-of-sale.entity");
const user_entity_1 = require("../../users/domain/user.entity");
const product_variant_entity_1 = require("../../product-variants/domain/product-variant.entity");
const transactions_service_1 = require("../../transactions/application/transactions.service");
const create_transaction_dto_1 = require("../../transactions/application/dto/create-transaction.dto");
let SalesFromSessionService = class SalesFromSessionService {
    constructor(transactionRepository, transactionLineRepository, cashSessionRepository, pointOfSaleRepository, userRepository, productVariantRepository, dataSource, transactionsService) {
        this.transactionRepository = transactionRepository;
        this.transactionLineRepository = transactionLineRepository;
        this.cashSessionRepository = cashSessionRepository;
        this.pointOfSaleRepository = pointOfSaleRepository;
        this.userRepository = userRepository;
        this.productVariantRepository = productVariantRepository;
        this.dataSource = dataSource;
        this.transactionsService = transactionsService;
    }
    async getSalesForSession(cashSessionId) {
        const cashSession = await this.cashSessionRepository.findOne({
            where: { id: cashSessionId },
        });
        if (!cashSession) {
            throw new common_1.NotFoundException(`Sesión de caja ${cashSessionId} no encontrada`);
        }
        const sales = await this.transactionRepository.find({
            where: {
                cashSessionId,
                transactionType: transaction_entity_1.TransactionType.SALE,
            },
            relations: ['lines', 'lines.productVariant', 'lines.productVariant.product'],
            order: {
                createdAt: 'DESC',
            },
        });
        const mappedSales = sales.map(transaction => ({
            id: transaction.id,
            type: transaction.transactionType,
            amount: transaction.total,
            paymentMethod: transaction.paymentMethod,
            status: transaction.status,
            createdAt: transaction.createdAt,
            documentNumber: transaction.documentNumber,
            externalReference: transaction.externalReference,
            notes: transaction.notes,
            lines: transaction.lines?.map(line => ({
                id: line.id,
                productVariantId: line.productVariantId,
                productName: line.productVariant?.product?.name || 'Producto desconocido',
                variantName: undefined,
                quantity: line.quantity,
                unitPrice: line.unitPrice,
                discountAmount: line.discountAmount,
                taxAmount: line.taxAmount,
                totalAmount: line.total,
            })) || [],
        }));
        return {
            success: true,
            cashSessionId,
            totalSales: sales.length,
            sales: mappedSales,
        };
    }
    async createSale(createSaleDto) {
        const { userName, pointOfSaleId, cashSessionId, paymentMethod, payments, lines, amountPaid, changeAmount, customerId, documentNumber, externalReference, notes, storageId, bankAccountKey, metadata, } = createSaleDto;
        if (!lines || lines.length === 0) {
            throw new common_1.BadRequestException('Debes enviar al menos una línea de venta');
        }
        let finalPaymentMethod = paymentMethod;
        if (payments && payments.length > 1) {
            finalPaymentMethod = transaction_entity_1.PaymentMethod.MIXED;
        }
        else if (payments && payments.length === 1) {
            finalPaymentMethod = payments[0].paymentMethod;
        }
        return await this.dataSource.transaction(async (manager) => {
            const user = await manager.getRepository(user_entity_1.User).findOne({
                where: { userName, deletedAt: (0, typeorm_2.IsNull)() },
            });
            if (!user) {
                throw new common_1.NotFoundException(`Usuario ${userName} no encontrado`);
            }
            const pointOfSale = await manager.getRepository(point_of_sale_entity_1.PointOfSale).findOne({
                where: { id: pointOfSaleId, deletedAt: (0, typeorm_2.IsNull)() },
            });
            if (!pointOfSale) {
                throw new common_1.NotFoundException(`Punto de venta ${pointOfSaleId} no encontrado`);
            }
            const cashSession = await manager.getRepository(cash_session_entity_1.CashSession).findOne({
                where: { id: cashSessionId },
            });
            if (!cashSession) {
                throw new common_1.NotFoundException(`Sesión de caja ${cashSessionId} no encontrada`);
            }
            if (cashSession.status !== cash_session_entity_1.CashSessionStatus.OPEN) {
                throw new common_1.ConflictException(`La sesión de caja está en estado ${cashSession.status}, no se pueden registrar ventas`);
            }
            let subtotal = 0;
            let taxAmount = 0;
            let discountAmount = 0;
            const transactionLines = [];
            for (const line of lines) {
                const variant = await manager.getRepository(product_variant_entity_1.ProductVariant).findOne({
                    where: { id: line.productVariantId },
                    relations: ['product'],
                });
                if (!variant) {
                    throw new common_1.NotFoundException(`Variante ${line.productVariantId} no encontrada`);
                }
                if (!variant.product) {
                    throw new common_1.NotFoundException(`Producto no encontrado para variante ${line.productVariantId}`);
                }
                const lineSubtotal = line.quantity * line.unitPrice;
                const lineDiscount = line.discountAmount || 0;
                const lineTax = line.taxAmount || 0;
                const lineTotal = lineSubtotal - lineDiscount + lineTax;
                subtotal += lineSubtotal;
                discountAmount += lineDiscount;
                taxAmount += lineTax;
                transactionLines.push({
                    productId: variant.productId,
                    productVariantId: line.productVariantId,
                    productName: variant.product.name,
                    productSku: variant.sku,
                    variantName: variant.product.name,
                    quantity: line.quantity,
                    unitPrice: line.unitPrice,
                    unitCost: line.unitCost || variant.baseCost || 0,
                    discountAmount: lineDiscount,
                    taxId: line.taxId || undefined,
                    taxRate: line.taxRate || 0,
                    taxAmount: lineTax,
                    subtotal: lineSubtotal - lineDiscount,
                    total: lineTotal,
                    notes: line.notes || undefined,
                });
            }
            const total = subtotal - discountAmount + taxAmount;
            const dto = new create_transaction_dto_1.CreateTransactionDto();
            Object.assign(dto, {
                transactionType: transaction_entity_1.TransactionType.SALE,
                branchId: pointOfSale.branchId,
                userId: user.id,
                pointOfSaleId: pointOfSale.id,
                cashSessionId: cashSession.id,
                customerId: customerId || undefined,
                subtotal,
                taxAmount,
                discountAmount,
                total,
                paymentMethod: finalPaymentMethod,
                amountPaid: amountPaid || total,
                changeAmount: changeAmount || 0,
                externalReference: externalReference || undefined,
                notes: notes || undefined,
                bankAccountKey: bankAccountKey || undefined,
                metadata: {
                    ...metadata,
                    paymentDetails: payments,
                    storageId: storageId || undefined,
                },
            });
            dto.lines = transactionLines.map((line) => {
                const lineDto = new create_transaction_dto_1.CreateTransactionLineDto();
                Object.assign(lineDto, line);
                return lineDto;
            });
            const finalTransaction = await this.transactionsService.createTransaction(dto);
            if (finalPaymentMethod === transaction_entity_1.PaymentMethod.CASH || finalPaymentMethod === transaction_entity_1.PaymentMethod.MIXED) {
                const cashAmount = amountPaid || total;
                const previousExpected = cashSession.expectedAmount || cashSession.openingAmount || 0;
                cashSession.expectedAmount = Number(previousExpected) + Number(cashAmount);
                await manager.getRepository(cash_session_entity_1.CashSession).save(cashSession);
            }
            return {
                success: true,
                transaction: {
                    id: finalTransaction.id,
                    documentNumber: finalTransaction.documentNumber,
                    transactionType: finalTransaction.transactionType,
                    total: Number(finalTransaction.total),
                    status: finalTransaction.status,
                    createdAt: finalTransaction.createdAt,
                    paymentMethod: finalTransaction.paymentMethod,
                    lines: transactionLines,
                },
                lines: transactionLines,
            };
        });
    }
    async addLineItem(saleId, lineItem) {
        throw new Error('Not implemented yet');
    }
    async updateLineItem(saleId, lineItemId, updates) {
        throw new Error('Not implemented yet');
    }
    async deleteLineItem(saleId, lineItemId) {
        throw new Error('Not implemented yet');
    }
    generateTempDocumentNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return `TEMP-${timestamp}-${random}`;
    }
};
exports.SalesFromSessionService = SalesFromSessionService;
exports.SalesFromSessionService = SalesFromSessionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(1, (0, typeorm_1.InjectRepository)(transaction_line_entity_1.TransactionLine)),
    __param(2, (0, typeorm_1.InjectRepository)(cash_session_entity_1.CashSession)),
    __param(3, (0, typeorm_1.InjectRepository)(point_of_sale_entity_1.PointOfSale)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(5, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        transactions_service_1.TransactionsService])
], SalesFromSessionService);
//# sourceMappingURL=sales-from-session.service.js.map