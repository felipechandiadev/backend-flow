"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationalExpensesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const operational_expense_entity_1 = require("./domain/operational-expense.entity");
const operational_expenses_service_1 = require("./application/operational-expenses.service");
const operational_expenses_controller_1 = require("./presentation/operational-expenses.controller");
const operational_expenses_repository_1 = require("./infrastructure/operational-expenses.repository");
let OperationalExpensesModule = class OperationalExpensesModule {
};
exports.OperationalExpensesModule = OperationalExpensesModule;
exports.OperationalExpensesModule = OperationalExpensesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([operational_expense_entity_1.OperationalExpense]),
        ],
        controllers: [operational_expenses_controller_1.OperationalExpensesController],
        providers: [
            operational_expenses_service_1.OperationalExpensesService,
            operational_expenses_repository_1.OperationalExpensesRepository,
        ],
        exports: [operational_expenses_service_1.OperationalExpensesService],
    })
], OperationalExpensesModule);
//# sourceMappingURL=operational-expenses.module.js.map