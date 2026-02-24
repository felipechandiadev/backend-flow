"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseCategoriesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const expense_category_entity_1 = require("./domain/expense-category.entity");
const expense_categories_service_1 = require("./application/expense-categories.service");
const expense_categories_controller_1 = require("./presentation/expense-categories.controller");
const expense_categories_repository_1 = require("./infrastructure/expense-categories.repository");
let ExpenseCategoriesModule = class ExpenseCategoriesModule {
};
exports.ExpenseCategoriesModule = ExpenseCategoriesModule;
exports.ExpenseCategoriesModule = ExpenseCategoriesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([expense_category_entity_1.ExpenseCategory]),
        ],
        controllers: [expense_categories_controller_1.ExpenseCategoriesController],
        providers: [
            expense_categories_service_1.ExpenseCategoriesService,
            expense_categories_repository_1.ExpenseCategoriesRepository,
        ],
        exports: [expense_categories_service_1.ExpenseCategoriesService],
    })
], ExpenseCategoriesModule);
//# sourceMappingURL=expense-categories.module.js.map