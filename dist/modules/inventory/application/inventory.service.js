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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const storages_service_1 = require("../../storages/application/storages.service");
const stock_level_entity_1 = require("../../stock-levels/domain/stock-level.entity");
const create_transaction_dto_1 = require("../../transactions/application/dto/create-transaction.dto");
const transactions_service_1 = require("../../transactions/application/transactions.service");
const transaction_entity_1 = require("../../transactions/domain/transaction.entity");
const user_entity_1 = require("../../users/domain/user.entity");
const branch_entity_1 = require("../../branches/domain/branch.entity");
let InventoryService = class InventoryService {
    constructor(storagesService, dataSource, transactionsService, userRepository) {
        this.storagesService = storagesService;
        this.dataSource = dataSource;
        this.transactionsService = transactionsService;
        this.userRepository = userRepository;
    }
    async getFilters() {
        const storages = await this.storagesService.getAllStorages(false);
        return {
            storages,
            branches: [],
            categories: [],
            units: [],
            attributes: [],
        };
    }
    async search(params) {
        const qb = this.dataSource
            .getRepository(stock_level_entity_1.StockLevel)
            .createQueryBuilder('sl')
            .leftJoinAndSelect('sl.variant', 'variant')
            .leftJoinAndSelect('variant.product', 'product')
            .leftJoinAndSelect('variant.unit', 'unit')
            .leftJoinAndSelect('sl.storage', 'storage');
        if (params?.storageId) {
            qb.andWhere('sl.storageId = :storageId', { storageId: params.storageId });
        }
        if (params?.branchId) {
            qb.andWhere('storage.branchId = :branchId', { branchId: params.branchId });
        }
        if (params?.search) {
            const s = `%${params.search}%`;
            qb.andWhere('(product.name LIKE :s OR variant.sku LIKE :s)', { s });
        }
        const entries = await qb.getMany();
        const grouped = {};
        for (const sl of entries) {
            const variant = sl.variant;
            const product = variant?.product;
            const vid = variant?.id || 'unknown';
            if (!grouped[vid]) {
                grouped[vid] = {
                    productId: product?.id || null,
                    variantId: variant?.id || null,
                    productName: product?.name || '',
                    sku: variant?.sku || '',
                    unitOfMeasure: variant?.unit?.name || '',
                    attributeValues: variant?.attributeValues || {},
                    totalStock: 0,
                    availableStock: 0,
                    inventoryValueCost: 0,
                    pmp: Number(variant?.pmp || 0),
                    storageBreakdown: [],
                    movements: [],
                    primaryStorageName: '',
                    primaryStorageQuantity: 0,
                    isBelowMinimum: false,
                };
            }
            const row = grouped[vid];
            const qty = Number(sl.physicalStock || 0);
            row.storageBreakdown.push({
                storageId: sl.storageId,
                storageName: sl.storage?.name || '',
                branchName: sl.storage?.branch?.name || null,
                quantity: qty,
            });
            row.totalStock += qty;
            row.availableStock += Number(sl.availableStock || 0);
            row.inventoryValueCost += qty * Number(variant?.baseCost || 0);
            if (!row.primaryStorageName) {
                row.primaryStorageName = sl.storage?.name || '';
                row.primaryStorageQuantity = qty;
            }
            if (variant && qty < (variant.minimumStock || 0)) {
                row.isBelowMinimum = true;
            }
        }
        const rows = Object.values(grouped);
        for (const r of rows) {
            r.pmpValue = Number(((r.totalStock || 0) * (r.pmp || 0)).toFixed(2));
        }
        const total = rows.length;
        const transactionLineRepo = this.dataSource.getRepository('TransactionLine');
        const transactionRepo = this.dataSource.getRepository('Transaction');
        for (const row of rows) {
            if (!row.variantId)
                continue;
            const movs = await transactionLineRepo
                .createQueryBuilder('tl')
                .innerJoin('tl.transaction', 't')
                .leftJoin('t.storageEntry', 's')
                .leftJoin('t.targetStorageEntry', 'ts')
                .where('tl.productVariantId = :vid', { vid: row.variantId })
                .orderBy('t.createdAt', 'DESC')
                .limit(5)
                .select([
                't.id as transactionId',
                't.documentNumber as documentNumber',
                't.transactionType as transactionType',
                't.createdAt as createdAt',
                'tl.quantity as quantity',
                't.notes as notes',
                's.name as storageName',
                'ts.name as targetStorageName',
            ])
                .getRawMany();
            row.movements = movs.map(m => ({
                ...m,
                direction: ['PURCHASE', 'TRANSFER_IN', 'ADJUSTMENT_IN', 'CASH_SESSION_OPENING'].includes(m.transactionType) ? 'IN' : 'OUT',
            }));
        }
        return { rows, total };
    }
    async adjust(data) {
        const { variantId, storageId, currentQuantity, targetQuantity, note } = data;
        const diff = targetQuantity - currentQuantity;
        let branchId;
        const raw = await this.dataSource
            .getRepository(stock_level_entity_1.StockLevel)
            .createQueryBuilder('sl')
            .leftJoin('sl.storage', 's')
            .where('sl.storageId = :sid', { sid: storageId })
            .select('s.branchId', 'branchId')
            .getRawOne();
        branchId = raw?.branchId || undefined;
        if (branchId === '')
            branchId = undefined;
        if (!branchId) {
            const anyBranch = await this.dataSource.getRepository(branch_entity_1.Branch).findOne({});
            branchId = anyBranch?.id;
        }
        const fallbackUser = await this.userRepository.findOne({ where: { deletedAt: null } });
        const userId = fallbackUser?.id || '';
        const txDto = new create_transaction_dto_1.CreateTransactionDto();
        txDto.transactionType = diff >= 0 ? transaction_entity_1.TransactionType.ADJUSTMENT_IN : transaction_entity_1.TransactionType.ADJUSTMENT_OUT;
        txDto.branchId = branchId || '';
        txDto.userId = userId;
        txDto.storageId = storageId;
        txDto.subtotal = Math.abs(diff);
        txDto.total = Math.abs(diff);
        txDto.paymentMethod = transaction_entity_1.PaymentMethod.INTERNAL_CREDIT;
        txDto.amountPaid = Math.abs(diff);
        txDto.notes = note || undefined;
        const tx = await this.transactionsService.createTransaction(txDto);
        return {
            success: true,
            message: `Stock ajustado en ${diff}`,
            documentNumbers: [tx.documentNumber],
        };
    }
    async transfer(data) {
        const { variantId, sourceStorageId, targetStorageId, quantity, note } = data;
        const src = await this.dataSource
            .getRepository(stock_level_entity_1.StockLevel)
            .findOne({ where: { productVariantId: variantId, storageId: sourceStorageId } });
        if (!src) {
            throw new common_1.NotFoundException('Stock no encontrado en almacén origen');
        }
        src.physicalStock = Number(src.physicalStock || 0) - quantity;
        await this.dataSource.getRepository(stock_level_entity_1.StockLevel).save(src);
        let tgt = await this.dataSource
            .getRepository(stock_level_entity_1.StockLevel)
            .findOne({ where: { productVariantId: variantId, storageId: targetStorageId } });
        if (!tgt) {
            tgt = this.dataSource.getRepository(stock_level_entity_1.StockLevel).create({
                productVariantId: variantId,
                storageId: targetStorageId,
                physicalStock: quantity,
            });
        }
        else {
            tgt.physicalStock = Number(tgt.physicalStock || 0) + quantity;
        }
        await this.dataSource.getRepository(stock_level_entity_1.StockLevel).save(tgt);
        let branchId;
        const rawSource = await this.dataSource.getRepository(stock_level_entity_1.StockLevel)
            .createQueryBuilder('sl')
            .leftJoin('sl.storage', 's')
            .where('sl.storageId = :sid', { sid: sourceStorageId })
            .select('s.branchId', 'branchId')
            .getRawOne();
        branchId = rawSource?.branchId || undefined;
        if (branchId === '') {
            branchId = undefined;
        }
        if (!branchId) {
            const rawTarget = await this.dataSource.getRepository(stock_level_entity_1.StockLevel)
                .createQueryBuilder('sl')
                .leftJoin('sl.storage', 's')
                .where('sl.storageId = :tid', { tid: targetStorageId })
                .select('s.branchId', 'branchId')
                .getRawOne();
            branchId = rawTarget?.branchId || undefined;
            if (branchId === '')
                branchId = undefined;
        }
        if (!branchId) {
            throw new common_1.BadRequestException('No se pudo determinar la sucursal asociada a los almacenes involucrados.');
        }
        const txOut = new create_transaction_dto_1.CreateTransactionDto();
        txOut.transactionType = transaction_entity_1.TransactionType.TRANSFER_OUT;
        txOut.branchId = branchId || '';
        const fallbackUser = await this.userRepository.findOne({ where: { deletedAt: null } });
        txOut.userId = fallbackUser?.id || '';
        txOut.storageId = sourceStorageId;
        txOut.targetStorageId = targetStorageId;
        txOut.subtotal = quantity;
        txOut.total = quantity;
        txOut.paymentMethod = undefined;
        txOut.amountPaid = quantity;
        txOut.notes = note || undefined;
        const out = await this.transactionsService.createTransaction(txOut);
        const txIn = new create_transaction_dto_1.CreateTransactionDto();
        txIn.transactionType = transaction_entity_1.TransactionType.TRANSFER_IN;
        txIn.branchId = branchId || '';
        txIn.userId = txOut.userId;
        txIn.storageId = targetStorageId;
        txIn.targetStorageId = sourceStorageId;
        txIn.subtotal = quantity;
        txIn.total = quantity;
        txIn.paymentMethod = undefined;
        txIn.amountPaid = quantity;
        txIn.notes = note || undefined;
        const inn = await this.transactionsService.createTransaction(txIn);
        return {
            success: true,
            message: 'Transferencia registrada',
            documentNumbers: [out.documentNumber, inn.documentNumber],
        };
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [storages_service_1.StoragesService,
        typeorm_2.DataSource,
        transactions_service_1.TransactionsService,
        typeorm_2.Repository])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map