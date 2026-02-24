"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const payments_controller_1 = require("./presentation/payments.controller");
const payments_service_1 = require("./application/payments.service");
const transaction_entity_1 = require("../transactions/domain/transaction.entity");
const cash_session_entity_1 = require("../cash-sessions/domain/cash-session.entity");
const point_of_sale_entity_1 = require("../points-of-sale/domain/point-of-sale.entity");
const user_entity_1 = require("../users/domain/user.entity");
const branch_entity_1 = require("../branches/domain/branch.entity");
const transactions_module_1 = require("../transactions/transactions.module");
const ledger_entries_module_1 = require("../ledger-entries/ledger-entries.module");
const installments_module_1 = require("../installments/installments.module");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                transaction_entity_1.Transaction,
                cash_session_entity_1.CashSession,
                point_of_sale_entity_1.PointOfSale,
                user_entity_1.User,
                branch_entity_1.Branch,
            ]),
            transactions_module_1.TransactionsModule,
            ledger_entries_module_1.LedgerEntriesModule,
            installments_module_1.InstallmentsModule,
        ],
        controllers: [payments_controller_1.PaymentsController],
        providers: [payments_service_1.PaymentsService],
    })
], PaymentsModule);
//# sourceMappingURL=payments.module.js.map