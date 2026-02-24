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
var ReceptionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceptionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reception_entity_1 = require("../domain/reception.entity");
const reception_line_entity_1 = require("../domain/reception-line.entity");
const storage_entity_1 = require("../../storages/domain/storage.entity");
const branch_entity_1 = require("../../branches/domain/branch.entity");
const company_entity_1 = require("../../companies/domain/company.entity");
const user_entity_1 = require("../../users/domain/user.entity");
const product_variants_service_1 = require("../../product-variants/application/product-variants.service");
const transactions_service_1 = require("../../transactions/application/transactions.service");
const create_transaction_dto_1 = require("../../transactions/application/dto/create-transaction.dto");
const transaction_entity_1 = require("../../transactions/domain/transaction.entity");
let ReceptionsService = ReceptionsService_1 = class ReceptionsService {
    constructor(receptionRepo, receptionLineRepo, storageRepo, branchRepo, companyRepo, userRepo, transactionsService, variantsService) {
        this.receptionRepo = receptionRepo;
        this.receptionLineRepo = receptionLineRepo;
        this.storageRepo = storageRepo;
        this.branchRepo = branchRepo;
        this.companyRepo = companyRepo;
        this.userRepo = userRepo;
        this.transactionsService = transactionsService;
        this.variantsService = variantsService;
        this.logger = new common_1.Logger(ReceptionsService_1.name);
    }
    async enrichReceptionLines(reception) {
        if (!reception || !Array.isArray(reception.lines))
            return;
        for (const l of reception.lines) {
            try {
                if (l.productVariantId) {
                    const v = await this.variantsService.findOne(String(l.productVariantId));
                    if (v) {
                        l.sku = l.sku || v.sku || l.sku;
                        l.productName = l.productName || v.product?.name || l.productName;
                        l.variantName = l.variantName || v.variantName || l.variantName;
                    }
                }
            }
            catch (err) {
            }
        }
    }
    getSupplierDisplayName(reception) {
        const supplier = reception?.supplier;
        if (!supplier)
            return null;
        const alias = typeof supplier.alias === 'string' ? supplier.alias.trim() : '';
        if (alias)
            return alias;
        const person = supplier.person;
        const businessName = typeof person?.businessName === 'string' ? person.businessName.trim() : '';
        if (businessName)
            return businessName;
        const firstName = typeof person?.firstName === 'string' ? person.firstName.trim() : '';
        const lastName = typeof person?.lastName === 'string' ? person.lastName.trim() : '';
        const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
        return fullName || null;
    }
    getStorageDisplayName(reception) {
        const name = typeof reception?.storage?.name === 'string' ? reception.storage.name.trim() : '';
        return name || null;
    }
    async buildLineSnapshot(line) {
        const variantId = line?.productVariantId || line?.variantId || line?.productVariant?.id || null;
        const baseName = typeof line?.productName === 'string' ? line.productName.trim() : '';
        let productName = baseName || '';
        let sku = typeof line?.sku === 'string' ? line.sku : undefined;
        let variantName = typeof line?.variantName === 'string' ? line.variantName : undefined;
        let productId = line?.productId || line?.product?.id || null;
        if (variantId && this.variantsService) {
            try {
                const v = await this.variantsService.findOne(String(variantId));
                if (v) {
                    sku = sku || v.sku || sku;
                    productName = productName || v.product?.name || productName;
                    variantName = variantName || v.variantName || variantName;
                    productId = productId || v.product?.id || productId;
                }
            }
            catch (err) {
            }
        }
        return {
            productId: productId || undefined,
            productVariantId: variantId || undefined,
            productName: productName || 'Item',
            sku,
            variantName,
        };
    }
    mapReceptionListItem(reception) {
        const documentNumber = reception?.documentNumber ||
            reception?.reference ||
            (typeof reception?.id === 'string' ? reception.id : null);
        return {
            ...reception,
            transactionType: transaction_entity_1.TransactionType.PURCHASE,
            status: transaction_entity_1.TransactionStatus.RECEIVED,
            supplierName: this.getSupplierDisplayName(reception),
            storageName: this.getStorageDisplayName(reception),
            documentNumber,
            purchaseOrderNumber: reception?.type === 'from-purchase-order'
                ? (reception?.documentNumber || reception?.reference || null)
                : null,
        };
    }
    async search(opts = { limit: 25, offset: 0 }) {
        const { limit = 25, offset = 0 } = opts;
        const [rows, count] = await this.receptionRepo.findAndCount({
            relations: ['lines', 'storage', 'branch', 'supplier', 'supplier.person', 'user'],
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });
        for (const r of rows) {
            await this.enrichReceptionLines(r);
        }
        return {
            rows: rows.map((row) => this.mapReceptionListItem(row)),
            count,
            limit,
            offset,
        };
    }
    async getById(id) {
        const found = await this.receptionRepo.findOne({
            where: { id },
            relations: ['lines', 'storage', 'branch', 'supplier', 'supplier.person', 'user'],
        });
        if (!found)
            throw new common_1.NotFoundException('Reception not found');
        await this.enrichReceptionLines(found);
        return this.mapReceptionListItem(found);
    }
    async maybeCreatePurchaseTransaction(reception) {
        try {
            let branchId = reception.branchId;
            if (!branchId && reception.storageId) {
                const storage = await this.storageRepo.findOne({ where: { id: reception.storageId } });
                if (storage && storage.branchId)
                    branchId = storage.branchId;
            }
            if (!branchId) {
                try {
                    const branchWithCompany = await this.branchRepo.findOne({ where: { companyId: (0, typeorm_2.Not)((0, typeorm_2.IsNull)()) } });
                    if (branchWithCompany && branchWithCompany.id) {
                        branchId = branchWithCompany.id;
                        this.logger.log(`Falling back to branch ${branchId} (with company) for reception transaction`);
                    }
                    else {
                        const anyBranch = await this.branchRepo.findOne({ where: {} });
                        if (anyBranch && anyBranch.id) {
                            if (!anyBranch.companyId) {
                                try {
                                    const lastCompany = await this.companyRepo.findOne({ order: { createdAt: 'DESC' } });
                                    if (lastCompany && lastCompany.id) {
                                        await this.branchRepo.update(anyBranch.id, { companyId: lastCompany.id });
                                        this.logger.log(`Assigned company ${lastCompany.id} to branch ${anyBranch.id} to allow transaction creation`);
                                        branchId = anyBranch.id;
                                    }
                                    else {
                                        branchId = anyBranch.id;
                                        this.logger.log(`Falling back to branch ${branchId} for reception transaction (no company found)`);
                                    }
                                }
                                catch (err) {
                                    branchId = anyBranch.id;
                                    this.logger.warn(`Could not assign company to branch ${anyBranch.id}: ${err.message}`);
                                }
                            }
                            else {
                                branchId = anyBranch.id;
                                this.logger.log(`Falling back to branch ${branchId} for reception transaction`);
                            }
                        }
                    }
                }
                catch (err) {
                }
            }
            if (!branchId) {
                this.logger.warn('Could not determine branchId for reception, skipping transaction creation');
                return null;
            }
            const dto = new create_transaction_dto_1.CreateTransactionDto();
            dto.transactionType = transaction_entity_1.TransactionType.PURCHASE;
            dto.branchId = branchId;
            let resolvedUserId = reception.userId;
            if (!resolvedUserId) {
                const fallbackUser = await this.userRepo.findOne({ where: {} });
                if (fallbackUser?.id) {
                    resolvedUserId = fallbackUser.id;
                    this.logger.log(`Falling back to user ${resolvedUserId} for reception transaction`);
                }
            }
            if (!resolvedUserId) {
                this.logger.warn('Could not determine userId for reception, skipping transaction creation');
                return null;
            }
            dto.userId = resolvedUserId;
            dto.supplierId = reception.supplierId || null;
            dto.storageId = reception.storageId || null;
            dto.subtotal = 0;
            dto.taxAmount = 0;
            dto.discountAmount = 0;
            dto.total = 0;
            dto.lines = [];
            dto.notes = reception.notes || null;
            dto.externalReference = reception.reference || reception.documentNumber || null;
            dto.metadata = {
                origin: 'RECEPTION',
                receptionId: reception.id,
                receptionType: reception.type || 'direct',
                storageId: reception.storageId || null,
                supplierId: reception.supplierId || null,
            };
            if (Array.isArray(reception.payments) && reception.payments.length > 0) {
                const sortedPayments = [...reception.payments].sort((a, b) => {
                    const dateA = new Date(a.dueDate);
                    const dateB = new Date(b.dueDate);
                    return dateA.getTime() - dateB.getTime();
                });
                dto.metadata.numberOfInstallments = sortedPayments.length;
                dto.metadata.firstDueDate = sortedPayments[0].dueDate;
                dto.metadata.paymentSchedule = sortedPayments.map((p, index) => ({
                    installmentNumber: index + 1,
                    amount: Number(p.amount),
                    dueDate: p.dueDate,
                }));
                this.logger.log(`[RECEPTION -> PURCHASE] Payment plan detected: ${sortedPayments.length} payments, ` +
                    `first due ${sortedPayments[0].dueDate}`);
            }
            if (!Array.isArray(reception.lines) || reception.lines.length === 0) {
                const loadedLines = await this.receptionLineRepo.find({
                    where: { receptionId: reception.id },
                });
                if (loadedLines.length > 0) {
                    reception.lines = loadedLines;
                }
            }
            if (Array.isArray(reception.lines)) {
                for (const l of reception.lines) {
                    const qty = Number(l.receivedQuantity ?? l.quantity ?? 0) || 0;
                    const unitPrice = Number(l.unitPrice ?? l.price ?? 0) || 0;
                    const lineSubtotal = qty * unitPrice;
                    const tline = {
                        productId: l.productId || undefined,
                        productVariantId: l.productVariantId || undefined,
                        productName: l.productName || l.product?.name || 'Item',
                        productSku: l.sku || l.productSku || undefined,
                        variantName: l.variantName || undefined,
                        quantity: qty,
                        unitPrice: unitPrice,
                        unitCost: Number(l.unitCost ?? 0) || 0,
                        discountPercentage: 0,
                        discountAmount: 0,
                        taxRate: 0,
                        taxAmount: 0,
                        subtotal: Number(lineSubtotal),
                        total: Number(lineSubtotal),
                    };
                    dto.lines.push(tline);
                    dto.subtotal += lineSubtotal;
                    dto.total += lineSubtotal;
                }
            }
            if ((dto.lines?.length ?? 0) === 0) {
                this.logger.warn('Reception has no lines, skipping transaction creation');
                return null;
            }
            const created = await this.transactionsService.createTransaction(dto);
            this.logger.log(`Created PURCHASE transaction ${created.id} for reception ${reception.id}`);
            try {
                reception.transactionId = created.id;
                reception.transaction = { id: created.id, documentNumber: created.documentNumber };
            }
            catch (err) {
            }
            return created;
        }
        catch (err) {
            const msg = err.message || 'unknown error';
            this.logger.error('Error creating purchase transaction for reception: ' + msg);
            return { error: msg };
        }
    }
    async create(data) {
        const reception = this.receptionRepo.create({
            type: data.type || 'direct',
            storageId: data.storageId,
            branchId: data.branchId,
            supplierId: data.supplierId,
            userId: data.userId,
            reference: data.reference,
            documentNumber: data.documentNumber,
            notes: data.notes,
            payments: data.payments,
            subtotal: 0,
            taxAmount: 0,
            discountAmount: 0,
            total: 0,
            lineCount: 0,
        });
        if (Array.isArray(data.lines)) {
            reception.lineCount = data.lines.length;
            reception.subtotal = data.lines.reduce((s, l) => {
                const qty = Number(l.receivedQuantity ?? l.quantity ?? 0) || 0;
                const unitPrice = Number(l.unitPrice ?? l.price ?? 0) || 0;
                return s + qty * unitPrice;
            }, 0);
            reception.total = Number(reception.subtotal || 0);
        }
        const savedReception = await this.receptionRepo.save(reception);
        if (Array.isArray(data.lines)) {
            for (let i = 0; i < data.lines.length; i++) {
                const l = data.lines[i];
                const qty = Number(l.receivedQuantity ?? l.quantity ?? 0) || 0;
                const unitPrice = Number(l.unitPrice ?? l.price ?? 0) || 0;
                const lineSubtotal = qty * unitPrice;
                const snapshot = await this.buildLineSnapshot(l);
                const receptionLine = this.receptionLineRepo.create({
                    receptionId: savedReception.id,
                    productId: snapshot.productId,
                    productVariantId: snapshot.productVariantId,
                    productName: snapshot.productName,
                    sku: snapshot.sku,
                    variantName: snapshot.variantName,
                    quantity: qty,
                    receivedQuantity: Number(l.receivedQuantity ?? qty),
                    unitPrice,
                    unitCost: Number(l.unitCost ?? 0) || 0,
                    subtotal: lineSubtotal,
                    lineNumber: i + 1,
                });
                await this.receptionLineRepo.save(receptionLine);
            }
        }
        const receptionWithLines = await this.receptionRepo.findOne({
            where: { id: savedReception.id },
            relations: ['lines'],
        });
        const tx = await this.maybeCreatePurchaseTransaction(receptionWithLines);
        if (tx && tx.id) {
            receptionWithLines.transactionId = tx.id;
            await this.receptionRepo.save(receptionWithLines);
        }
        return {
            success: true,
            reception: receptionWithLines,
            transaction: tx && tx.id ? { id: tx.id } : null,
            transactionError: tx && tx.error ? tx.error : null,
        };
    }
    async createDirect(data) {
        const reception = this.receptionRepo.create({
            type: 'direct',
            storageId: data.storageId,
            branchId: data.branchId,
            supplierId: data.supplierId,
            userId: data.userId,
            reference: data.reference,
            documentNumber: data.documentNumber,
            notes: data.notes,
            payments: data.payments,
            subtotal: 0,
            taxAmount: 0,
            discountAmount: 0,
            total: 0,
            lineCount: 0,
        });
        if (Array.isArray(data.lines)) {
            reception.lineCount = data.lines.length;
            reception.subtotal = data.lines.reduce((s, l) => {
                const qty = Number(l.receivedQuantity ?? l.quantity ?? 0) || 0;
                const unitPrice = Number(l.unitPrice ?? l.price ?? 0) || 0;
                return s + qty * unitPrice;
            }, 0);
            reception.total = Number(reception.subtotal || 0);
        }
        const savedReception = await this.receptionRepo.save(reception);
        if (Array.isArray(data.lines)) {
            for (let i = 0; i < data.lines.length; i++) {
                const l = data.lines[i];
                const qty = Number(l.receivedQuantity ?? l.quantity ?? 0) || 0;
                const unitPrice = Number(l.unitPrice ?? l.price ?? 0) || 0;
                const lineSubtotal = qty * unitPrice;
                const snapshot = await this.buildLineSnapshot(l);
                const receptionLine = this.receptionLineRepo.create({
                    receptionId: savedReception.id,
                    productId: snapshot.productId,
                    productVariantId: snapshot.productVariantId,
                    productName: snapshot.productName,
                    sku: snapshot.sku,
                    variantName: snapshot.variantName,
                    quantity: qty,
                    receivedQuantity: Number(l.receivedQuantity ?? qty),
                    unitPrice,
                    unitCost: Number(l.unitCost ?? 0) || 0,
                    subtotal: lineSubtotal,
                    lineNumber: i + 1,
                });
                await this.receptionLineRepo.save(receptionLine);
            }
        }
        const receptionWithLines = await this.receptionRepo.findOne({
            where: { id: savedReception.id },
            relations: ['lines'],
        });
        const tx = await this.maybeCreatePurchaseTransaction(receptionWithLines);
        if (tx && tx.id) {
            receptionWithLines.transactionId = tx.id;
            await this.receptionRepo.save(receptionWithLines);
        }
        return {
            success: true,
            reception: receptionWithLines,
            transaction: tx && tx.id ? { id: tx.id } : null,
            transactionError: tx && tx.error ? tx.error : null,
        };
    }
    async createFromPurchaseOrder(data) {
        const reception = this.receptionRepo.create({
            type: 'from-purchase-order',
            storageId: data.storageId,
            branchId: data.branchId,
            supplierId: data.supplierId,
            userId: data.userId,
            reference: data.reference,
            documentNumber: data.documentNumber,
            notes: data.notes,
            payments: data.payments,
            subtotal: 0,
            taxAmount: 0,
            discountAmount: 0,
            total: 0,
            lineCount: 0,
        });
        if (Array.isArray(data.lines)) {
            reception.lineCount = data.lines.length;
            reception.subtotal = data.lines.reduce((s, l) => {
                const qty = Number(l.receivedQuantity ?? l.quantity ?? 0) || 0;
                const unitPrice = Number(l.unitPrice ?? l.price ?? 0) || 0;
                return s + qty * unitPrice;
            }, 0);
            reception.total = Number(reception.subtotal || 0);
        }
        const savedReception = await this.receptionRepo.save(reception);
        if (Array.isArray(data.lines)) {
            for (let i = 0; i < data.lines.length; i++) {
                const l = data.lines[i];
                const qty = Number(l.receivedQuantity ?? l.quantity ?? 0) || 0;
                const unitPrice = Number(l.unitPrice ?? l.price ?? 0) || 0;
                const lineSubtotal = qty * unitPrice;
                const snapshot = await this.buildLineSnapshot(l);
                const receptionLine = this.receptionLineRepo.create({
                    receptionId: savedReception.id,
                    productId: snapshot.productId,
                    productVariantId: snapshot.productVariantId,
                    productName: snapshot.productName,
                    sku: snapshot.sku,
                    variantName: snapshot.variantName,
                    quantity: qty,
                    receivedQuantity: Number(l.receivedQuantity ?? qty),
                    unitPrice,
                    unitCost: Number(l.unitCost ?? 0) || 0,
                    subtotal: lineSubtotal,
                    lineNumber: i + 1,
                });
                await this.receptionLineRepo.save(receptionLine);
            }
        }
        const receptionWithLines = await this.receptionRepo.findOne({
            where: { id: savedReception.id },
            relations: ['lines'],
        });
        const tx = await this.maybeCreatePurchaseTransaction(receptionWithLines);
        if (tx && tx.id) {
            receptionWithLines.transactionId = tx.id;
            await this.receptionRepo.save(receptionWithLines);
        }
        return {
            success: true,
            reception: receptionWithLines,
            transaction: tx && tx.id ? { id: tx.id } : null,
            transactionError: tx && tx.error ? tx.error : null,
        };
    }
};
exports.ReceptionsService = ReceptionsService;
exports.ReceptionsService = ReceptionsService = ReceptionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reception_entity_1.Reception)),
    __param(1, (0, typeorm_1.InjectRepository)(reception_line_entity_1.ReceptionLine)),
    __param(2, (0, typeorm_1.InjectRepository)(storage_entity_1.Storage)),
    __param(3, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __param(4, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        transactions_service_1.TransactionsService,
        product_variants_service_1.ProductVariantsService])
], ReceptionsService);
//# sourceMappingURL=receptions.service.js.map