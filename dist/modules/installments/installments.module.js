"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallmentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const installment_entity_1 = require("./domain/installment.entity");
const transaction_entity_1 = require("../transactions/domain/transaction.entity");
const installment_repository_1 = require("./infrastructure/installment.repository");
const installment_service_1 = require("./application/services/installment.service");
const installment_controller_1 = require("./presentation/installment.controller");
const accounts_receivable_controller_1 = require("./presentation/accounts-receivable.controller");
const transactions_module_1 = require("../transactions/transactions.module");
let InstallmentsModule = class InstallmentsModule {
};
exports.InstallmentsModule = InstallmentsModule;
exports.InstallmentsModule = InstallmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([installment_entity_1.Installment, transaction_entity_1.Transaction]), transactions_module_1.TransactionsModule],
        controllers: [installment_controller_1.InstallmentController, accounts_receivable_controller_1.AccountsReceivableController],
        providers: [installment_repository_1.InstallmentRepository, installment_service_1.InstallmentService],
        exports: [installment_service_1.InstallmentService, installment_repository_1.InstallmentRepository],
    })
], InstallmentsModule);
//# sourceMappingURL=installments.module.js.map