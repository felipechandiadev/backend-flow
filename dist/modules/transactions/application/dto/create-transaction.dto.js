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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBankWithdrawalToShareholderDto = exports.CreateBankTransferDto = exports.CreateCashDepositDto = exports.CreateCapitalContributionDto = exports.CreateTransactionDto = exports.CreateTransactionLineDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const transaction_entity_1 = require("../../domain/transaction.entity");
class CreateTransactionLineDto {
    constructor() {
        this.discountPercentage = 0;
        this.discountAmount = 0;
        this.taxRate = 0;
        this.taxAmount = 0;
    }
}
exports.CreateTransactionLineDto = CreateTransactionLineDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTransactionLineDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTransactionLineDto.prototype, "productVariantId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTransactionLineDto.prototype, "unitId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionLineDto.prototype, "productName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionLineDto.prototype, "productSku", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionLineDto.prototype, "variantName", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreateTransactionLineDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTransactionLineDto.prototype, "unitPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTransactionLineDto.prototype, "unitCost", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTransactionLineDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTransactionLineDto.prototype, "discountAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTransactionLineDto.prototype, "taxId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTransactionLineDto.prototype, "taxRate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTransactionLineDto.prototype, "taxAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTransactionLineDto.prototype, "subtotal", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTransactionLineDto.prototype, "total", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionLineDto.prototype, "notes", void 0);
const class_validator_2 = require("class-validator");
class CreateTransactionDto {
    constructor() {
        this.subtotal = 0;
        this.taxAmount = 0;
        this.discountAmount = 0;
        this.paymentMethod = transaction_entity_1.PaymentMethod.CASH;
        this.amountPaid = 0;
        this.lines = [];
    }
    validate() {
        const errors = [];
        const syncErrors = (0, class_validator_2.validateSync)(this, { skipMissingProperties: false });
        if (syncErrors && syncErrors.length > 0) {
            const extract = (err) => {
                if (err.constraints) {
                    errors.push(...Object.values(err.constraints));
                }
                if (err.children && err.children.length) {
                    err.children.forEach(extract);
                }
            };
            syncErrors.forEach(extract);
        }
        const requirePositive = [
            transaction_entity_1.TransactionType.SALE,
            transaction_entity_1.TransactionType.PURCHASE,
            transaction_entity_1.TransactionType.SUPPLIER_PAYMENT,
            transaction_entity_1.TransactionType.EXPENSE_PAYMENT,
            transaction_entity_1.TransactionType.CASH_DEPOSIT,
            transaction_entity_1.TransactionType.BANK_WITHDRAWAL_TO_SHAREHOLDER,
            transaction_entity_1.TransactionType.PAYMENT_IN,
            transaction_entity_1.TransactionType.PAYMENT_OUT,
            transaction_entity_1.TransactionType.PAYROLL,
            transaction_entity_1.TransactionType.PAYMENT_EXECUTION,
        ];
        if (requirePositive.includes(this.transactionType)) {
            if (this.subtotal < 0.01) {
                errors.push('subtotal debe ser mayor a 0');
            }
            if (this.total < 0.01) {
                errors.push('total debe ser mayor a 0');
            }
        }
        switch (this.transactionType) {
            case transaction_entity_1.TransactionType.PAYMENT_IN:
                if (this.metadata?.capitalContribution && !this.shareholderId && !this.bankAccountKey) {
                    errors.push('capitalContribution requiere shareholderId o bankAccountKey');
                }
                break;
            case transaction_entity_1.TransactionType.PAYMENT_OUT:
                if (this.metadata?.bankToCashTransfer && !this.bankAccountKey) {
                    errors.push('bankToCashTransfer requiere bankAccountKey');
                }
                if (this.supplierId && !this.total) {
                    errors.push('Pago a proveedor requiere monto');
                }
                break;
            case transaction_entity_1.TransactionType.PAYMENT_EXECUTION:
                if (!this.relatedTransactionId) {
                    errors.push('PAYMENT_EXECUTION requiere relatedTransactionId (PAYMENT_OUT)');
                }
                if (!this.total) {
                    errors.push('PAYMENT_EXECUTION requiere monto');
                }
                if (!this.paymentMethod) {
                    errors.push('PAYMENT_EXECUTION requiere paymentMethod');
                }
                break;
            case transaction_entity_1.TransactionType.SUPPLIER_PAYMENT:
                if (!this.supplierId) {
                    errors.push('SUPPLIER_PAYMENT requiere supplierId');
                }
                if (!this.relatedTransactionId) {
                    errors.push('SUPPLIER_PAYMENT requiere relatedTransactionId (PURCHASE)');
                }
                if (!this.total) {
                    errors.push('SUPPLIER_PAYMENT requiere monto');
                }
                if (!this.paymentMethod) {
                    errors.push('SUPPLIER_PAYMENT requiere paymentMethod');
                }
                break;
            case transaction_entity_1.TransactionType.EXPENSE_PAYMENT:
                if (!this.expenseCategoryId) {
                    errors.push('EXPENSE_PAYMENT requiere expenseCategoryId');
                }
                if (!this.total) {
                    errors.push('EXPENSE_PAYMENT requiere monto');
                }
                if (!this.paymentMethod) {
                    errors.push('EXPENSE_PAYMENT requiere paymentMethod');
                }
                break;
            case transaction_entity_1.TransactionType.CASH_DEPOSIT:
                if (!this.bankAccountKey) {
                    errors.push('CASH_DEPOSIT requiere bankAccountKey');
                }
                break;
            case transaction_entity_1.TransactionType.CASH_SESSION_OPENING:
                if (!this.pointOfSaleId) {
                    errors.push('CASH_SESSION_OPENING requiere pointOfSaleId');
                }
                break;
            case transaction_entity_1.TransactionType.SALE:
                if (!this.customerId && !this.pointOfSaleId) {
                    errors.push('SALE requiere customerId o pointOfSaleId');
                }
                if (this.lines && this.lines.length === 0) {
                    errors.push('SALE requiere al menos una línea');
                }
                break;
            case transaction_entity_1.TransactionType.PURCHASE:
                if (!this.supplierId) {
                    errors.push('PURCHASE requiere supplierId');
                }
                if (this.lines && this.lines.length === 0) {
                    errors.push('PURCHASE requiere al menos una línea');
                }
                break;
            case transaction_entity_1.TransactionType.OPERATING_EXPENSE:
                if (!this.expenseCategoryId) {
                    errors.push('OPERATING_EXPENSE requiere expenseCategoryId');
                }
                break;
        }
        if (this.lines && this.lines.length > 0) {
            const linesTotal = this.lines.reduce((sum, line) => sum + line.total, 0);
            if (Math.abs(linesTotal - this.total) > 0.01) {
                errors.push(`Total de líneas (${linesTotal}) no coincide con total (${this.total})`);
            }
        }
        return errors;
    }
}
exports.CreateTransactionDto = CreateTransactionDto;
__decorate([
    (0, class_validator_1.IsEnum)(transaction_entity_1.TransactionType),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "transactionType", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "subtotal", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "taxAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "discountAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "total", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(transaction_entity_1.PaymentMethod),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(transaction_entity_1.PaymentStatus),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "amountPaid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "changeAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "supplierId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "shareholderId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "employeeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "pointOfSaleId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "cashSessionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "storageId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "targetStorageId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "expenseCategoryId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "resultCenterId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "accountingPeriodId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "documentType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "documentFolio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "paymentDueDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "relatedTransactionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "externalReference", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "bankAccountKey", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateTransactionLineDto),
    (0, class_validator_1.ArrayMinSize)(0),
    __metadata("design:type", Array)
], CreateTransactionDto.prototype, "lines", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTransactionDto.prototype, "metadata", void 0);
class CreateCapitalContributionDto {
    toCreateTransactionDto(userId, branchId) {
        const dto = new CreateTransactionDto();
        dto.transactionType = transaction_entity_1.TransactionType.PAYMENT_IN;
        dto.branchId = branchId;
        dto.userId = userId;
        dto.shareholderId = this.shareholderId;
        dto.bankAccountKey = this.bankAccountKey;
        dto.subtotal = this.amount;
        dto.taxAmount = 0;
        dto.discountAmount = 0;
        dto.total = this.amount;
        dto.paymentMethod = transaction_entity_1.PaymentMethod.TRANSFER;
        dto.amountPaid = this.amount;
        dto.notes = this.notes;
        dto.metadata = {
            capitalContribution: true,
            occurredOn: this.occurredOn,
        };
        return dto;
    }
}
exports.CreateCapitalContributionDto = CreateCapitalContributionDto;
class CreateCashDepositDto {
    toCreateTransactionDto(userId, branchId) {
        const dto = new CreateTransactionDto();
        dto.transactionType = transaction_entity_1.TransactionType.CASH_DEPOSIT;
        dto.branchId = branchId;
        dto.userId = userId;
        dto.bankAccountKey = this.bankAccountKey;
        dto.subtotal = this.amount;
        dto.taxAmount = 0;
        dto.discountAmount = 0;
        dto.total = this.amount;
        dto.paymentMethod = transaction_entity_1.PaymentMethod.CASH;
        dto.amountPaid = this.amount;
        dto.notes = this.notes;
        dto.metadata = {
            cashDeposit: true,
            occurredOn: this.occurredOn,
        };
        return dto;
    }
}
exports.CreateCashDepositDto = CreateCashDepositDto;
class CreateBankTransferDto {
    toCreateTransactionDto(userId, branchId) {
        const dto = new CreateTransactionDto();
        dto.transactionType = transaction_entity_1.TransactionType.PAYMENT_OUT;
        dto.branchId = branchId;
        dto.userId = userId;
        dto.bankAccountKey = this.bankAccountKey;
        dto.subtotal = this.amount;
        dto.taxAmount = 0;
        dto.discountAmount = 0;
        dto.total = this.amount;
        dto.paymentMethod = transaction_entity_1.PaymentMethod.TRANSFER;
        dto.amountPaid = this.amount;
        dto.notes = this.notes;
        dto.metadata = {
            bankToCashTransfer: true,
            occurredOn: this.occurredOn,
        };
        return dto;
    }
}
exports.CreateBankTransferDto = CreateBankTransferDto;
class CreateBankWithdrawalToShareholderDto {
    toCreateTransactionDto(userId, branchId) {
        const dto = new CreateTransactionDto();
        dto.transactionType = transaction_entity_1.TransactionType.BANK_WITHDRAWAL_TO_SHAREHOLDER;
        dto.branchId = branchId;
        dto.userId = userId;
        dto.shareholderId = this.shareholderId;
        dto.bankAccountKey = this.bankAccountKey;
        dto.subtotal = this.amount;
        dto.taxAmount = 0;
        dto.discountAmount = 0;
        dto.total = this.amount;
        dto.paymentMethod = transaction_entity_1.PaymentMethod.TRANSFER;
        dto.amountPaid = this.amount;
        dto.notes = this.notes;
        dto.metadata = {
            bankWithdrawalToShareholder: true,
            occurredOn: this.occurredOn,
        };
        return dto;
    }
}
exports.CreateBankWithdrawalToShareholderDto = CreateBankWithdrawalToShareholderDto;
//# sourceMappingURL=create-transaction.dto.js.map