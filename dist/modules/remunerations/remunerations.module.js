"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemunerationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const remunerations_service_1 = require("./application/remunerations.service");
const remunerations_controller_1 = require("./presentation/remunerations.controller");
const transaction_entity_1 = require("../transactions/domain/transaction.entity");
const employee_entity_1 = require("../employees/domain/employee.entity");
const result_center_entity_1 = require("../result-centers/domain/result-center.entity");
const branch_entity_1 = require("../branches/domain/branch.entity");
const user_entity_1 = require("../users/domain/user.entity");
const transactions_module_1 = require("../transactions/transactions.module");
let RemunerationsModule = class RemunerationsModule {
};
exports.RemunerationsModule = RemunerationsModule;
exports.RemunerationsModule = RemunerationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                transaction_entity_1.Transaction,
                employee_entity_1.Employee,
                result_center_entity_1.ResultCenter,
                branch_entity_1.Branch,
                user_entity_1.User,
            ]),
            transactions_module_1.TransactionsModule,
        ],
        controllers: [remunerations_controller_1.RemunerationsController],
        providers: [remunerations_service_1.RemunerationsService],
        exports: [remunerations_service_1.RemunerationsService],
    })
], RemunerationsModule);
//# sourceMappingURL=remunerations.module.js.map