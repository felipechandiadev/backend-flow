"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankTransfersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const transaction_entity_1 = require("../transactions/domain/transaction.entity");
const user_entity_1 = require("../users/domain/user.entity");
const branch_entity_1 = require("../branches/domain/branch.entity");
const transactions_module_1 = require("../transactions/transactions.module");
const bank_transfers_service_1 = require("./application/bank-transfers.service");
const bank_transfers_controller_1 = require("./presentation/bank-transfers.controller");
let BankTransfersModule = class BankTransfersModule {
};
exports.BankTransfersModule = BankTransfersModule;
exports.BankTransfersModule = BankTransfersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([transaction_entity_1.Transaction, user_entity_1.User, branch_entity_1.Branch]),
            transactions_module_1.TransactionsModule,
        ],
        controllers: [bank_transfers_controller_1.BankTransfersController],
        providers: [bank_transfers_service_1.BankTransfersService],
        exports: [bank_transfers_service_1.BankTransfersService],
    })
], BankTransfersModule);
//# sourceMappingURL=bank-transfers.module.js.map