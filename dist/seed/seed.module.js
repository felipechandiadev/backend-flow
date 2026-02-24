"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const seed_service_1 = require("./seed.service");
const company_entity_1 = require("../modules/companies/domain/company.entity");
const branch_entity_1 = require("../modules/branches/domain/branch.entity");
const user_entity_1 = require("../modules/users/domain/user.entity");
const person_entity_1 = require("../modules/persons/domain/person.entity");
const customer_entity_1 = require("../modules/customers/domain/customer.entity");
const supplier_entity_1 = require("../modules/suppliers/domain/supplier.entity");
const shareholder_entity_1 = require("../modules/shareholders/domain/shareholder.entity");
const tax_entity_1 = require("../modules/taxes/domain/tax.entity");
const category_entity_1 = require("../modules/categories/domain/category.entity");
const price_list_entity_1 = require("../modules/price-lists/domain/price-list.entity");
const price_list_item_entity_1 = require("../modules/price-list-items/domain/price-list-item.entity");
const storage_entity_1 = require("../modules/storages/domain/storage.entity");
const point_of_sale_entity_1 = require("../modules/points-of-sale/domain/point-of-sale.entity");
const cash_session_entity_1 = require("../modules/cash-sessions/domain/cash-session.entity");
const attribute_entity_1 = require("../modules/attributes/domain/attribute.entity");
const product_entity_1 = require("../modules/products/domain/product.entity");
const product_variant_entity_1 = require("../modules/product-variants/domain/product-variant.entity");
const unit_entity_1 = require("../modules/units/domain/unit.entity");
const accounting_account_entity_1 = require("../modules/accounting-accounts/domain/accounting-account.entity");
const expense_category_entity_1 = require("../modules/expense-categories/domain/expense-category.entity");
const accounting_rule_entity_1 = require("../modules/accounting-rules/domain/accounting-rule.entity");
const accounting_period_entity_1 = require("../modules/accounting-periods/domain/accounting-period.entity");
const transaction_entity_1 = require("../modules/transactions/domain/transaction.entity");
const transaction_line_entity_1 = require("../modules/transaction-lines/domain/transaction-line.entity");
const treasury_account_entity_1 = require("../modules/treasury-accounts/domain/treasury-account.entity");
const result_center_entity_1 = require("../modules/result-centers/domain/result-center.entity");
const organizational_unit_entity_1 = require("../modules/organizational-units/domain/organizational-unit.entity");
const employee_entity_1 = require("../modules/employees/domain/employee.entity");
let SeedModule = class SeedModule {
};
exports.SeedModule = SeedModule;
exports.SeedModule = SeedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                company_entity_1.Company,
                branch_entity_1.Branch,
                user_entity_1.User,
                person_entity_1.Person,
                customer_entity_1.Customer,
                supplier_entity_1.Supplier,
                shareholder_entity_1.Shareholder,
                tax_entity_1.Tax,
                category_entity_1.Category,
                price_list_entity_1.PriceList,
                price_list_item_entity_1.PriceListItem,
                storage_entity_1.Storage,
                point_of_sale_entity_1.PointOfSale,
                cash_session_entity_1.CashSession,
                attribute_entity_1.Attribute,
                product_entity_1.Product,
                product_variant_entity_1.ProductVariant,
                unit_entity_1.Unit,
                accounting_account_entity_1.AccountingAccount,
                expense_category_entity_1.ExpenseCategory,
                accounting_rule_entity_1.AccountingRule,
                accounting_period_entity_1.AccountingPeriod,
                transaction_entity_1.Transaction,
                transaction_line_entity_1.TransactionLine,
                treasury_account_entity_1.TreasuryAccount,
                result_center_entity_1.ResultCenter,
                organizational_unit_entity_1.OrganizationalUnit,
                employee_entity_1.Employee,
            ]),
        ],
        providers: [seed_service_1.SeedService],
        exports: [seed_service_1.SeedService],
    })
], SeedModule);
//# sourceMappingURL=seed.module.js.map