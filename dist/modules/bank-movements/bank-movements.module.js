"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankMovementsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const company_entity_1 = require("../companies/domain/company.entity");
const transaction_entity_1 = require("../transactions/domain/transaction.entity");
const bank_movements_service_1 = require("./application/bank-movements.service");
const bank_movements_controller_1 = require("./presentation/bank-movements.controller");
let BankMovementsModule = class BankMovementsModule {
};
exports.BankMovementsModule = BankMovementsModule;
exports.BankMovementsModule = BankMovementsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([transaction_entity_1.Transaction, company_entity_1.Company])],
        controllers: [bank_movements_controller_1.BankMovementsController],
        providers: [bank_movements_service_1.BankMovementsService],
        exports: [bank_movements_service_1.BankMovementsService],
    })
], BankMovementsModule);
//# sourceMappingURL=bank-movements.module.js.map