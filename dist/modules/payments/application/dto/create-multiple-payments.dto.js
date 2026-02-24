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
exports.CreateMultiplePaymentsDto = exports.PaymentItemDto = exports.SubPaymentDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const transaction_entity_1 = require("../../../transactions/domain/transaction.entity");
class SubPaymentDto {
}
exports.SubPaymentDto = SubPaymentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubPaymentDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubPaymentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubPaymentDto.prototype, "dueDate", void 0);
class PaymentItemDto {
}
exports.PaymentItemDto = PaymentItemDto;
__decorate([
    (0, class_validator_1.IsEnum)(transaction_entity_1.PaymentMethod),
    __metadata("design:type", String)
], PaymentItemDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PaymentItemDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentItemDto.prototype, "bankAccountId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SubPaymentDto),
    __metadata("design:type", Array)
], PaymentItemDto.prototype, "subPayments", void 0);
class CreateMultiplePaymentsDto {
}
exports.CreateMultiplePaymentsDto = CreateMultiplePaymentsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMultiplePaymentsDto.prototype, "saleTransactionId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PaymentItemDto),
    __metadata("design:type", Array)
], CreateMultiplePaymentsDto.prototype, "payments", void 0);
//# sourceMappingURL=create-multiple-payments.dto.js.map