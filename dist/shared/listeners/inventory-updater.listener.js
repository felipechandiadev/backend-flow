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
var InventoryUpdaterListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryUpdaterListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const typeorm_1 = require("typeorm");
const transaction_created_event_1 = require("../events/transaction-created.event");
const transaction_entity_1 = require("../../modules/transactions/domain/transaction.entity");
const stock_level_entity_1 = require("../../modules/stock-levels/domain/stock-level.entity");
const transaction_entity_2 = require("../../modules/transactions/domain/transaction.entity");
const product_variant_entity_1 = require("../../modules/product-variants/domain/product-variant.entity");
let InventoryUpdaterListener = InventoryUpdaterListener_1 = class InventoryUpdaterListener {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(InventoryUpdaterListener_1.name);
    }
    async handleTransactionCreated(payload) {
        try {
            const tx = payload.transaction;
            const type = tx.transactionType;
            const incomingTypes = [
                transaction_entity_1.TransactionType.PURCHASE,
                transaction_entity_1.TransactionType.TRANSFER_IN,
                transaction_entity_1.TransactionType.ADJUSTMENT_IN,
            ];
            const outgoingTypes = [
                transaction_entity_1.TransactionType.SALE,
                transaction_entity_1.TransactionType.TRANSFER_OUT,
                transaction_entity_1.TransactionType.ADJUSTMENT_OUT,
            ];
            if (![...incomingTypes, ...outgoingTypes].includes(type)) {
                return;
            }
            await this.dataSource.transaction(async (manager) => {
                const txRepo = manager.getRepository(transaction_entity_2.Transaction);
                const txFull = await txRepo.findOne({ where: { id: tx.id }, relations: ['lines'] });
                const lines = (txFull && txFull.lines) || tx.lines || [];
                const stockRepo = manager.getRepository(stock_level_entity_1.StockLevel);
                const storageId = tx.storageId ?? tx.targetStorageId ?? null;
                if (!storageId) {
                    this.logger.warn(`Transaction ${tx.id} has no storageId; skipping inventory update.`);
                    return;
                }
                for (const line of lines) {
                    const variantId = line.productVariantId;
                    let qty = Number(line.quantity ?? line.receivedQuantity ?? 0) || 0;
                    if (!variantId || qty === 0)
                        continue;
                    if (outgoingTypes.includes(type)) {
                        qty = -qty;
                    }
                    let stockEntry = await stockRepo.findOne({ where: { productVariantId: variantId, storageId } });
                    const previousStock = stockEntry ? Number(stockEntry.physicalStock ?? 0) : 0;
                    if (!stockEntry) {
                        stockEntry = stockRepo.create({
                            productVariantId: variantId,
                            storageId,
                            physicalStock: qty,
                            committedStock: 0,
                            availableStock: qty,
                            incomingStock: 0,
                            lastTransactionId: tx.id,
                        });
                    }
                    else {
                        stockEntry.physicalStock = Number((Number(stockEntry.physicalStock ?? 0) + qty).toFixed(6));
                        stockEntry.availableStock = Number((Number(stockEntry.availableStock ?? 0) + qty).toFixed(6));
                        stockEntry.lastTransactionId = tx.id;
                    }
                    await stockRepo.save(stockEntry);
                    const sign = qty >= 0 ? '+' : '';
                    this.logger.log(`Updated stock for variant ${variantId} in storage ${storageId}: ${sign}${qty}`);
                    const unitCost = Number(line.unitCost ?? 0) || 0;
                    if (unitCost > 0 && qty > 0) {
                        const variantRepo = manager.getRepository(product_variant_entity_1.ProductVariant);
                        const variant = await variantRepo.findOne({ where: { id: variantId } });
                        if (variant) {
                            const prevPmp = Number(variant.pmp ?? 0);
                            const newPmp = previousStock <= 0
                                ? unitCost
                                : (previousStock * prevPmp + qty * unitCost) / (previousStock + qty);
                            variant.pmp = Number(newPmp.toFixed(2));
                            await variantRepo.save(variant);
                            this.logger.log(`Recalculated PMP for variant ${variantId}: ${variant.pmp}`);
                        }
                    }
                }
            });
        }
        catch (err) {
            this.logger.error('Error updating inventory after transaction.created: ' + err.message);
        }
    }
};
exports.InventoryUpdaterListener = InventoryUpdaterListener;
__decorate([
    (0, event_emitter_1.OnEvent)('transaction.created', { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transaction_created_event_1.TransactionCreatedEvent]),
    __metadata("design:returntype", Promise)
], InventoryUpdaterListener.prototype, "handleTransactionCreated", null);
exports.InventoryUpdaterListener = InventoryUpdaterListener = InventoryUpdaterListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], InventoryUpdaterListener);
//# sourceMappingURL=inventory-updater.listener.js.map