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
exports.OpenCashSessionDto = void 0;
const class_validator_1 = require("class-validator");
class OpenCashSessionDto {
    constructor() {
        this.openingAmount = 0;
    }
}
exports.OpenCashSessionDto = OpenCashSessionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'userId es obligatorio' }),
    __metadata("design:type", String)
], OpenCashSessionDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OpenCashSessionDto.prototype, "userName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'pointOfSaleId es obligatorio' }),
    __metadata("design:type", String)
], OpenCashSessionDto.prototype, "pointOfSaleId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'El monto de apertura no puede ser negativo' }),
    __metadata("design:type", Number)
], OpenCashSessionDto.prototype, "openingAmount", void 0);
//# sourceMappingURL=open-cash-session.dto.js.map