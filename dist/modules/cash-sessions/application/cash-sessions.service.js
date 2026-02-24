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
exports.CashSessionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const treasury_account_entity_1 = require("../../treasury-accounts/domain/treasury-account.entity");
const cash_session_entity_1 = require("../domain/cash-session.entity");
const point_of_sale_entity_1 = require("../../points-of-sale/domain/point-of-sale.entity");
const user_entity_1 = require("../../users/domain/user.entity");
const transaction_entity_1 = require("../../transactions/domain/transaction.entity");
const transaction_line_entity_1 = require("../../transaction-lines/domain/transaction-line.entity");
const product_variant_entity_1 = require("../../product-variants/domain/product-variant.entity");
const stock_level_entity_1 = require("../../stock-levels/domain/stock-level.entity");
const storage_entity_1 = require("../../storages/domain/storage.entity");
let CashSessionsService = class CashSessionsService {
    constructor(cashSessionRepository, pointOfSaleRepository, userRepository, transactionRepository, transactionLineRepository, productVariantRepository, dataSource, treasuryAccountRepository) {
        this.cashSessionRepository = cashSessionRepository;
        this.pointOfSaleRepository = pointOfSaleRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.transactionLineRepository = transactionLineRepository;
        this.productVariantRepository = productVariantRepository;
        this.dataSource = dataSource;
        this.treasuryAccountRepository = treasuryAccountRepository;
    }
    async findOne(id) {
        const cashSession = await this.cashSessionRepository.findOne({
            where: { id, deletedAt: null },
            relations: ['pointOfSale', 'openedBy', 'openedBy.person', 'closedBy', 'closedBy.person'],
        });
        if (!cashSession) {
            return { success: false, message: 'Sesión de caja no encontrada' };
        }
        return {
            success: true,
            cashSession: {
                ...cashSession,
                openedBy: cashSession.openedBy
                    ? {
                        id: cashSession.openedBy.id,
                        userName: cashSession.openedBy.userName,
                        person: cashSession.openedBy.person
                            ? {
                                firstName: cashSession.openedBy.person.firstName,
                                lastName: cashSession.openedBy.person.lastName,
                            }
                            : null,
                    }
                    : null,
                closedBy: cashSession.closedBy
                    ? {
                        id: cashSession.closedBy.id,
                        userName: cashSession.closedBy.userName,
                        person: cashSession.closedBy.person
                            ? {
                                firstName: cashSession.closedBy.person.firstName,
                                lastName: cashSession.closedBy.person.lastName,
                            }
                            : null,
                    }
                    : null,
            },
        };
    }
    async open(openDto) {
        const { userId, userName, pointOfSaleId, openingAmount } = openDto;
        const pointOfSale = await this.pointOfSaleRepository.findOne({
            where: { id: pointOfSaleId, deletedAt: (0, typeorm_2.IsNull)() },
            relations: ['branch'],
        });
        if (!pointOfSale) {
            throw new common_1.NotFoundException('El punto de venta especificado no existe.');
        }
        const companyId = pointOfSale.branch?.companyId;
        if (!companyId) {
            throw new common_1.BadRequestException('No se pudo determinar la empresa asociada al punto de venta.');
        }
        const { buildLedger } = await Promise.resolve().then(() => require('../../../shared/application/AccountingEngine'));
        const ledger = await buildLedger(this.dataSource, { companyId });
        const CASH_ACCOUNT_CODE = '1.1.01';
        const cashAccount = ledger.accounts.find((account) => account.code === CASH_ACCOUNT_CODE);
        const rawBalance = cashAccount ? ledger.balanceByAccount[cashAccount.id] ?? 0 : 0;
        const balance = Number.isFinite(rawBalance) ? Number(rawBalance) : 0;
        if (balance <= 0) {
            throw new common_1.BadRequestException('No hay saldo suficiente en Caja General para abrir una nueva sesión de caja.');
        }
        let validatedUser = null;
        if (userId) {
            validatedUser = await this.userRepository.findOne({ where: { id: userId, deletedAt: (0, typeorm_2.IsNull)() } });
        }
        if (!validatedUser && userName) {
            validatedUser = await this.userRepository.findOne({ where: { userName, deletedAt: (0, typeorm_2.IsNull)() } });
        }
        if (!validatedUser) {
            throw new common_1.NotFoundException('El usuario especificado no existe.');
        }
        const result = await this.dataSource.transaction(async (manager) => {
            const cashSessionRepo = manager.getRepository(cash_session_entity_1.CashSession);
            const existingOpenSession = await cashSessionRepo.findOne({
                where: {
                    pointOfSaleId: pointOfSale.id,
                    status: cash_session_entity_1.CashSessionStatus.OPEN,
                },
            });
            if (existingOpenSession) {
                if (existingOpenSession.openedById !== validatedUser.id) {
                    throw new common_1.ConflictException('El punto de venta ya tiene una sesión abierta por otro usuario. Cierre la sesión existente primero.');
                }
                return existingOpenSession;
            }
            const openedAt = new Date();
            const newSession = cashSessionRepo.create({
                pointOfSaleId: pointOfSale.id,
                openedById: validatedUser.id,
                openingAmount,
                openedAt,
                status: cash_session_entity_1.CashSessionStatus.OPEN,
            });
            const savedSession = await cashSessionRepo.save(newSession);
            return savedSession;
        });
        const userWithPerson = await this.userRepository.findOne({
            where: { id: validatedUser.id },
            relations: ['person'],
        });
        const cashSessionPayload = {
            id: result.id,
            pointOfSaleId: result.pointOfSaleId,
            openedById: result.openedById,
            status: result.status,
            openingAmount: Number(result.openingAmount),
            openedAt: result.openedAt,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            expectedAmount: result.expectedAmount ? Number(result.expectedAmount) : null,
            closingAmount: result.closingAmount ? Number(result.closingAmount) : null,
            closedAt: result.closedAt || null,
            difference: result.difference ? Number(result.difference) : null,
            notes: result.notes || null,
            closingDetails: result.closingDetails || null,
            openedBy: userWithPerson
                ? {
                    id: userWithPerson.id,
                    userName: userWithPerson.userName,
                    person: userWithPerson.person
                        ? {
                            id: userWithPerson.person.id,
                            firstName: userWithPerson.person.firstName,
                            lastName: userWithPerson.person.lastName,
                        }
                        : null,
                }
                : null,
        };
        return {
            success: true,
            cashSession: cashSessionPayload,
            suggestedOpeningAmount: openingAmount,
            pointOfSale: {
                id: pointOfSale.id,
                name: pointOfSale.name,
                deviceId: pointOfSale.deviceId || null,
                branchId: pointOfSale.branchId || null,
                branchName: pointOfSale.branch?.name || null,
                priceLists: Array.isArray(pointOfSale.priceLists) ? pointOfSale.priceLists : [],
            },
        };
    }
    async getSales(cashSessionId) {
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
            amount: transaction.taxAmount,
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
                totalAmount: line.taxAmount,
            })) || [],
        }));
        return {
            success: true,
            cashSessionId,
            totalSales: sales.length,
            sales: mappedSales,
        };
    }
    async findAll(query) {
        const qb = this.cashSessionRepository
            .createQueryBuilder('cs')
            .leftJoinAndSelect('cs.pointOfSale', 'pointOfSale')
            .leftJoinAndSelect('cs.openedBy', 'openedBy')
            .leftJoinAndSelect('openedBy.person', 'openedByPerson')
            .leftJoinAndSelect('cs.closedBy', 'closedBy')
            .leftJoinAndSelect('closedBy.person', 'closedByPerson');
        if (query.pointOfSaleId) {
            qb.andWhere('cs.pointOfSaleId = :pointOfSaleId', { pointOfSaleId: query.pointOfSaleId });
        }
        if (query.status) {
            qb.andWhere('cs.status = :status', { status: query.status });
        }
        qb.orderBy('cs.createdAt', 'DESC');
        const [items, total] = await qb.take(100).getManyAndCount();
        const mapped = items.map(cs => ({
            ...cs,
            openedByUserName: cs.openedBy?.userName || null,
            openedByFullName: cs.openedBy?.person ?
                `${cs.openedBy.person.firstName} ${cs.openedBy.person.lastName}` : null,
            closedByUserName: cs.closedBy?.userName || null,
            closedByFullName: cs.closedBy?.person ?
                `${cs.closedBy.person.firstName} ${cs.closedBy.person.lastName}` : null,
        }));
        return { success: true, total, items: mapped };
    }
    async createSale(createSaleDto) {
        const { userName, pointOfSaleId, cashSessionId, paymentMethod, payments, lines, amountPaid, changeAmount, customerId, documentNumber, externalReference, notes, storageId, bankAccountKey, metadata, } = createSaleDto;
        if (!lines || lines.length === 0) {
            throw new common_1.BadRequestException('Debes enviar al menos una línea de venta');
        }
        let finalPaymentMethod = paymentMethod;
        let paymentDetails = payments;
        if (payments && payments.length > 1) {
            finalPaymentMethod = 'MIXED';
            paymentDetails = payments;
        }
        else if (payments && payments.length === 1) {
            finalPaymentMethod = payments[0].paymentMethod;
            paymentDetails = payments;
        }
        const paymentMethodEnum = this.parsePaymentMethod(finalPaymentMethod);
        if (!paymentMethodEnum) {
            throw new common_1.BadRequestException(`Método de pago inválido: ${finalPaymentMethod}`);
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
            if (cashSession.pointOfSaleId && cashSession.pointOfSaleId !== pointOfSale.id) {
                throw new common_1.ConflictException('La sesión de caja no pertenece al punto de venta especificado');
            }
            const documentNum = documentNumber || await this.generateDocumentNumber(manager, pointOfSale.id, 'SALE');
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
            const transactionData = {
                documentNumber: documentNum,
                transactionType: transaction_entity_1.TransactionType.SALE,
                status: transaction_entity_1.TransactionStatus.CONFIRMED,
                branchId: pointOfSale.branchId || undefined,
                pointOfSaleId: pointOfSale.id,
                cashSessionId: cashSession.id,
                storageId: storageId || undefined,
                customerId: customerId || undefined,
                userId: user.id,
                subtotal,
                taxAmount,
                discountAmount,
                total,
                paymentMethod: paymentMethodEnum,
                bankAccountKey: bankAccountKey || undefined,
                amountPaid: amountPaid || total,
                changeAmount: changeAmount || 0,
                documentType: 'TICKET',
                documentFolio: documentNum,
                externalReference: externalReference || undefined,
                notes: notes || undefined,
                metadata: {
                    ...(metadata || {}),
                    ...(paymentDetails && paymentMethodEnum === transaction_entity_1.PaymentMethod.MIXED ? { mixedPayments: paymentDetails } : {}),
                },
            };
            const savedTransaction = await manager.getRepository(transaction_entity_1.Transaction).save(transactionData);
            const savedLines = [];
            for (const lineData of transactionLines) {
                const lineToSave = {
                    ...lineData,
                    transactionId: savedTransaction.id,
                };
                const savedLine = await manager.getRepository(transaction_line_entity_1.TransactionLine).save(lineToSave);
                savedLines.push(savedLine);
            }
            try {
                let targetStorageId = storageId || undefined;
                if (!targetStorageId) {
                    const storageRepo = manager.getRepository(storage_entity_1.Storage);
                    const defaultStorage = await storageRepo.findOne({ where: { branchId: pointOfSale.branchId ?? undefined, isDefault: true } });
                    if (defaultStorage) {
                        targetStorageId = defaultStorage.id;
                    }
                }
                if (targetStorageId) {
                    const stockRepo = manager.getRepository(stock_level_entity_1.StockLevel);
                    for (const savedLine of savedLines) {
                        const variantId = savedLine.productVariantId;
                        const qty = Number(savedLine.quantity ?? 0);
                        let stockEntry = await stockRepo.findOne({ where: { productVariantId: variantId, storageId: targetStorageId } });
                        if (!stockEntry) {
                            stockEntry = stockRepo.create({
                                productVariantId: variantId,
                                storageId: targetStorageId,
                                physicalStock: 0 - qty,
                                committedStock: 0,
                                availableStock: 0 - qty,
                                incomingStock: 0,
                                lastTransactionId: savedTransaction.id,
                            });
                        }
                        else {
                            stockEntry.physicalStock = Number((Number(stockEntry.physicalStock ?? 0) - qty).toFixed(6));
                            stockEntry.availableStock = Number((Number(stockEntry.availableStock ?? 0) - qty).toFixed(6));
                            stockEntry.lastTransactionId = savedTransaction.id;
                        }
                        await stockRepo.save(stockEntry);
                    }
                }
            }
            catch (err) {
                console.warn('No se pudo actualizar StockLevel después de la venta', err);
            }
            if (changeAmount && changeAmount > 0) {
                const prev = cashSession.expectedAmount ?? cashSession.openingAmount ?? 0;
                cashSession.expectedAmount = Number(prev) - Number(changeAmount);
                await manager.getRepository(cash_session_entity_1.CashSession).save(cashSession);
            }
            return {
                success: true,
                transaction: {
                    id: savedTransaction.id,
                    documentNumber: savedTransaction.documentNumber,
                    type: savedTransaction.transactionType,
                    status: savedTransaction.status,
                    total: savedTransaction.total,
                    paymentMethod: savedTransaction.paymentMethod,
                    createdAt: savedTransaction.createdAt,
                },
                lines: savedLines.map(line => ({
                    id: line.id,
                    productVariantId: line.productVariantId,
                    quantity: line.quantity,
                    unitPrice: line.unitPrice,
                    total: line.total,
                })),
            };
        });
    }
    parsePaymentMethod(method) {
        const normalized = method?.toUpperCase().trim();
        if (Object.values(transaction_entity_1.PaymentMethod).includes(normalized)) {
            return normalized;
        }
        return null;
    }
    async generateDocumentNumber(manager, pointOfSaleId, type) {
        const lastTransaction = await manager
            .getRepository(transaction_entity_1.Transaction)
            .createQueryBuilder('t')
            .where('t.pointOfSaleId = :pointOfSaleId', { pointOfSaleId })
            .andWhere('t.transactionType = :type', { type })
            .orderBy('t.createdAt', 'DESC')
            .getOne();
        let nextNumber = 1;
        if (lastTransaction && lastTransaction.documentNumber) {
            const match = lastTransaction.documentNumber.match(/(\d+)$/);
            if (match) {
                nextNumber = parseInt(match[1], 10) + 1;
            }
        }
        return `${type}-${String(nextNumber).padStart(8, '0')}`;
    }
    async registerOpeningTransaction(dto) {
        const { cashSessionId, openingAmount, openedById, comment } = dto;
        const session = await this.cashSessionRepository.findOne({
            where: { id: cashSessionId },
            relations: ['openedBy', 'openedBy.person']
        });
        if (!session)
            throw new common_1.NotFoundException('Sesión de caja no encontrada');
        if (!session.pointOfSaleId)
            throw new common_1.BadRequestException('El punto de venta de la sesión no está definido');
        const documentNumber = await this.generateDocumentNumber(this.dataSource.manager, session.pointOfSaleId, transaction_entity_1.TransactionType.CASH_SESSION_OPENING);
        const transaction = this.transactionRepository.create({
            transactionType: transaction_entity_1.TransactionType.CASH_SESSION_OPENING,
            status: transaction_entity_1.TransactionStatus.CONFIRMED,
            pointOfSaleId: session.pointOfSaleId,
            cashSessionId: session.id,
            userId: openedById,
            subtotal: openingAmount,
            total: openingAmount,
            paymentMethod: transaction_entity_1.PaymentMethod.CASH,
            documentNumber,
            metadata: { comment },
        });
        const savedTransaction = await this.transactionRepository.save(transaction);
        session.openingAmount = openingAmount;
        const updatedSession = await this.cashSessionRepository.save(session);
        return {
            success: true,
            cashSession: {
                id: updatedSession.id,
                pointOfSaleId: updatedSession.pointOfSaleId,
                openedById: updatedSession.openedById,
                status: updatedSession.status,
                openingAmount: Number(updatedSession.openingAmount),
                openedAt: updatedSession.openedAt,
                createdAt: updatedSession.createdAt,
                updatedAt: updatedSession.updatedAt,
                expectedAmount: updatedSession.expectedAmount ? Number(updatedSession.expectedAmount) : null,
                closingAmount: updatedSession.closingAmount ? Number(updatedSession.closingAmount) : null,
                closedAt: updatedSession.closedAt || null,
                difference: updatedSession.difference ? Number(updatedSession.difference) : null,
                notes: updatedSession.notes || null,
                closingDetails: updatedSession.closingDetails || null,
                openedBy: updatedSession.openedBy
                    ? {
                        id: updatedSession.openedBy.id,
                        userName: updatedSession.openedBy.userName,
                        person: updatedSession.openedBy.person
                            ? {
                                id: updatedSession.openedBy.person.id,
                                firstName: updatedSession.openedBy.person.firstName,
                                lastName: updatedSession.openedBy.person.lastName,
                            }
                            : null,
                    }
                    : null,
            },
            transaction: {
                id: savedTransaction.id,
                documentNumber: savedTransaction.documentNumber,
                createdAt: savedTransaction.createdAt,
                total: Number(savedTransaction.total),
            },
        };
    }
    async registerCashDeposit(input) {
        const { userName, pointOfSaleId, cashSessionId, amount, reason } = input;
        return await this.dataSource.transaction(async (manager) => {
            const session = await manager.getRepository(cash_session_entity_1.CashSession).findOne({ where: { id: cashSessionId } });
            if (!session)
                throw new common_1.NotFoundException('Sesión de caja no encontrada');
            const user = await manager.getRepository(user_entity_1.User).findOne({ where: { userName, deletedAt: (0, typeorm_2.IsNull)() } });
            if (!user)
                throw new common_1.NotFoundException('Usuario no encontrado');
            const transaction = manager.getRepository(transaction_entity_1.Transaction).create({
                transactionType: transaction_entity_1.TransactionType.CASH_SESSION_DEPOSIT,
                status: transaction_entity_1.TransactionStatus.CONFIRMED,
                pointOfSaleId: session.pointOfSaleId || pointOfSaleId,
                cashSessionId: session.id,
                userId: user.id,
                subtotal: amount,
                total: amount,
                paymentMethod: transaction_entity_1.PaymentMethod.CASH,
                documentNumber: await this.generateDocumentNumber(manager, session.pointOfSaleId || pointOfSaleId, transaction_entity_1.TransactionType.CASH_SESSION_DEPOSIT),
                metadata: { reason },
            });
            const saved = await manager.getRepository(transaction_entity_1.Transaction).save(transaction);
            session.expectedAmount = await this.recomputeCashSessionExpectedAmount(manager, session);
            await manager.getRepository(cash_session_entity_1.CashSession).save(session);
            return {
                success: true,
                transaction: { id: saved.id, documentNumber: saved.documentNumber, createdAt: saved.createdAt, total: saved.total },
                expectedAmount: session.expectedAmount,
            };
        });
    }
    async registerCashWithdrawal(input) {
        const { userName, pointOfSaleId, cashSessionId, amount, reason } = input;
        return await this.dataSource.transaction(async (manager) => {
            const session = await manager.getRepository(cash_session_entity_1.CashSession).findOne({ where: { id: cashSessionId } });
            if (!session)
                throw new common_1.NotFoundException('Sesión de caja no encontrada');
            const user = await manager.getRepository(user_entity_1.User).findOne({ where: { userName, deletedAt: (0, typeorm_2.IsNull)() } });
            if (!user)
                throw new common_1.NotFoundException('Usuario no encontrado');
            const transaction = manager.getRepository(transaction_entity_1.Transaction).create({
                transactionType: transaction_entity_1.TransactionType.CASH_SESSION_WITHDRAWAL,
                status: transaction_entity_1.TransactionStatus.CONFIRMED,
                pointOfSaleId: session.pointOfSaleId || pointOfSaleId,
                cashSessionId: session.id,
                userId: user.id,
                subtotal: amount,
                total: amount,
                paymentMethod: transaction_entity_1.PaymentMethod.CASH,
                documentNumber: await this.generateDocumentNumber(manager, session.pointOfSaleId || pointOfSaleId, transaction_entity_1.TransactionType.CASH_SESSION_WITHDRAWAL),
                metadata: { reason },
            });
            const saved = await manager.getRepository(transaction_entity_1.Transaction).save(transaction);
            session.expectedAmount = await this.recomputeCashSessionExpectedAmount(manager, session);
            await manager.getRepository(cash_session_entity_1.CashSession).save(session);
            return {
                success: true,
                transaction: { id: saved.id, documentNumber: saved.documentNumber, createdAt: saved.createdAt, total: saved.total },
                expectedAmount: session.expectedAmount,
            };
        });
    }
    async closeCashSession(input) {
        const { userName, cashSessionId, actualCash, notes } = input;
        const session = await this.cashSessionRepository.findOne({ where: { id: cashSessionId } });
        if (!session)
            throw new common_1.NotFoundException('Sesión de caja no encontrada');
        const user = await this.userRepository.findOne({ where: { userName, deletedAt: (0, typeorm_2.IsNull)() } });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        const expected = Number(session.expectedAmount ?? session.openingAmount ?? 0);
        session.closingAmount = Number(actualCash);
        session.closedAt = new Date();
        session.status = cash_session_entity_1.CashSessionStatus.CLOSED;
        session.difference = Number(actualCash) - expected;
        const closingDetails = {
            countedByUserId: user.id,
            countedByUserName: user.userName || null,
            countedAt: new Date().toISOString(),
            notes: notes || null,
            actual: {
                cash: Number(actualCash) || 0,
                debitCard: Number(input.voucherDebitAmount || 0) || 0,
                creditCard: Number(input.voucherCreditAmount || 0) || 0,
                transfer: Number(input.transferAmount || 0) || 0,
                check: Number(input.checkAmount || 0) || 0,
                other: Number(input.otherAmount || 0) || 0,
            },
            expected: {
                cash: expected || 0,
                debitCard: 0,
                creditCard: 0,
                transfer: 0,
                check: 0,
                other: 0,
            },
            difference: {
                cash: Number(session.difference) || 0,
                total: Number(session.difference) || 0,
            },
        };
        session.closingDetails = closingDetails;
        session.closedById = user.id;
        await this.cashSessionRepository.save(session);
        return {
            success: true,
            session: {
                id: session.id,
                status: session.status,
                pointOfSaleId: session.pointOfSaleId,
                openedById: session.openedById ?? null,
                openedAt: session.openedAt || null,
                openingAmount: Number(session.openingAmount),
                expectedAmount: Number(session.expectedAmount ?? null),
                closingAmount: Number(session.closingAmount),
                difference: Number(session.difference),
                closedAt: session.closedAt || null,
                notes: session.notes || null,
                closingDetails: session.closingDetails || null,
            },
            closing: {
                actual: { cash: Number(session.closingAmount) },
                expected: { cash: expected },
                difference: { cash: Number(session.difference), total: Number(session.difference) },
            },
        };
    }
    async recomputeCashSessionExpectedAmount(manager, cashSession) {
        const transactions = await manager.getRepository(transaction_entity_1.Transaction).find({
            where: {
                cashSessionId: cashSession.id,
                status: transaction_entity_1.TransactionStatus.CONFIRMED,
            },
        });
        let cashIn = 0;
        let cashOut = 0;
        for (const tx of transactions) {
            const total = Number(tx.total) || 0;
            const amountPaid = Number(tx.amountPaid) || 0;
            const changeAmount = Number(tx.changeAmount) || 0;
            switch (tx.transactionType) {
                case transaction_entity_1.TransactionType.CASH_SESSION_OPENING:
                case transaction_entity_1.TransactionType.CASH_SESSION_DEPOSIT:
                    cashIn += total;
                    break;
                case transaction_entity_1.TransactionType.PAYMENT_IN:
                    if (tx.paymentMethod === transaction_entity_1.PaymentMethod.CASH) {
                        cashIn += total;
                    }
                    break;
                case transaction_entity_1.TransactionType.SALE:
                    break;
                case transaction_entity_1.TransactionType.CASH_SESSION_WITHDRAWAL:
                case transaction_entity_1.TransactionType.OPERATING_EXPENSE:
                case transaction_entity_1.TransactionType.PAYMENT_OUT:
                case transaction_entity_1.TransactionType.SALE_RETURN:
                    cashOut += total;
                    break;
                default:
                    break;
            }
        }
        const opening = Number(cashSession.openingAmount) || 0;
        const expected = opening + cashIn - cashOut;
        return Number(expected.toFixed(2));
    }
};
exports.CashSessionsService = CashSessionsService;
exports.CashSessionsService = CashSessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cash_session_entity_1.CashSession)),
    __param(1, (0, typeorm_1.InjectRepository)(point_of_sale_entity_1.PointOfSale)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(4, (0, typeorm_1.InjectRepository)(transaction_line_entity_1.TransactionLine)),
    __param(5, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariant)),
    __param(7, (0, typeorm_1.InjectRepository)(treasury_account_entity_1.TreasuryAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        typeorm_2.Repository])
], CashSessionsService);
//# sourceMappingURL=cash-sessions.service.js.map