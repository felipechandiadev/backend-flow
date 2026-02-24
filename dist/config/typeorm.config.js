"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
require("reflect-metadata");
const point_of_sale_entity_1 = require("../modules/points-of-sale/domain/point-of-sale.entity");
const branch_entity_1 = require("../modules/branches/domain/branch.entity");
const company_entity_1 = require("../modules/companies/domain/company.entity");
const price_list_entity_1 = require("../modules/price-lists/domain/price-list.entity");
const user_entity_1 = require("../modules/users/domain/user.entity");
const person_entity_1 = require("../modules/persons/domain/person.entity");
const cash_session_entity_1 = require("../modules/cash-sessions/domain/cash-session.entity");
const transaction_entity_1 = require("../modules/transactions/domain/transaction.entity");
const transaction_line_entity_1 = require("../modules/transaction-lines/domain/transaction-line.entity");
const product_entity_1 = require("../modules/products/domain/product.entity");
const product_variant_entity_1 = require("../modules/product-variants/domain/product-variant.entity");
const customer_entity_1 = require("../modules/customers/domain/customer.entity");
const tax_entity_1 = require("../modules/taxes/domain/tax.entity");
const unit_entity_1 = require("../modules/units/domain/unit.entity");
const category_entity_1 = require("../modules/categories/domain/category.entity");
const supplier_entity_1 = require("../modules/suppliers/domain/supplier.entity");
const treasury_account_entity_1 = require("../modules/treasury-accounts/domain/treasury-account.entity");
const storage_entity_1 = require("../modules/storages/domain/storage.entity");
const result_center_entity_1 = require("../modules/result-centers/domain/result-center.entity");
const expense_category_entity_1 = require("../modules/expense-categories/domain/expense-category.entity");
const operational_expense_entity_1 = require("../modules/operational-expenses/domain/operational-expense.entity");
const accounting_account_entity_1 = require("../modules/accounting-accounts/domain/accounting-account.entity");
const accounting_rule_entity_1 = require("../modules/accounting-rules/domain/accounting-rule.entity");
const accounting_period_entity_1 = require("../modules/accounting-periods/domain/accounting-period.entity");
const accounting_period_snapshot_entity_1 = require("../modules/accounting-period-snapshots/domain/accounting-period-snapshot.entity");
const account_balance_entity_1 = require("../modules/account-balances/domain/account-balance.entity");
const attribute_entity_1 = require("../modules/attributes/domain/attribute.entity");
const price_list_item_entity_1 = require("../modules/price-list-items/domain/price-list-item.entity");
const gold_price_entity_1 = require("../modules/gold-prices/domain/gold-price.entity");
const audit_entity_1 = require("../modules/audits/domain/audit.entity");
const permission_enum_1 = require("../modules/permissions/domain/permission.enum");
const ledger_entry_entity_1 = require("../modules/ledger-entries/domain/ledger-entry.entity");
const organizational_unit_entity_1 = require("../modules/organizational-units/domain/organizational-unit.entity");
const employee_entity_1 = require("../modules/employees/domain/employee.entity");
const shareholder_entity_1 = require("../modules/shareholders/domain/shareholder.entity");
const budget_entity_1 = require("../modules/budgets/domain/budget.entity");
const stock_level_entity_1 = require("../modules/stock-levels/domain/stock-level.entity");
const reception_entity_1 = require("../modules/receptions/domain/reception.entity");
const reception_line_entity_1 = require("../modules/receptions/domain/reception-line.entity");
const installment_entity_1 = require("../modules/installments/domain/installment.entity");
const AuditSubscriber_1 = require("../subscribers/AuditSubscriber");
const typeOrmConfig = (configService) => ({
    type: 'mysql',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 3306),
    username: configService.get('DB_USERNAME', 'root'),
    password: configService.get('DB_PASSWORD', ''),
    database: configService.get('DB_DATABASE', 'flow-store'),
    entities: [
        point_of_sale_entity_1.PointOfSale,
        branch_entity_1.Branch,
        company_entity_1.Company,
        price_list_entity_1.PriceList,
        user_entity_1.User,
        person_entity_1.Person,
        cash_session_entity_1.CashSession,
        transaction_entity_1.Transaction,
        transaction_line_entity_1.TransactionLine,
        product_entity_1.Product,
        product_variant_entity_1.ProductVariant,
        customer_entity_1.Customer,
        tax_entity_1.Tax,
        unit_entity_1.Unit,
        category_entity_1.Category,
        supplier_entity_1.Supplier,
        treasury_account_entity_1.TreasuryAccount,
        storage_entity_1.Storage,
        result_center_entity_1.ResultCenter,
        expense_category_entity_1.ExpenseCategory,
        operational_expense_entity_1.OperationalExpense,
        accounting_account_entity_1.AccountingAccount,
        accounting_rule_entity_1.AccountingRule,
        accounting_period_entity_1.AccountingPeriod,
        accounting_period_snapshot_entity_1.AccountingPeriodSnapshot,
        account_balance_entity_1.AccountBalance,
        attribute_entity_1.Attribute,
        price_list_item_entity_1.PriceListItem,
        gold_price_entity_1.GoldPrice,
        audit_entity_1.Audit,
        permission_enum_1.Permission,
        ledger_entry_entity_1.LedgerEntry,
        organizational_unit_entity_1.OrganizationalUnit,
        employee_entity_1.Employee,
        shareholder_entity_1.Shareholder,
        budget_entity_1.Budget,
        stock_level_entity_1.StockLevel,
        reception_entity_1.Reception,
        reception_line_entity_1.ReceptionLine,
        installment_entity_1.Installment,
    ],
    subscribers: [
        AuditSubscriber_1.AuditSubscriber,
    ],
    synchronize: false,
    logging: configService.get('DB_LOGGING', 'false') === 'true',
    extra: {
        connectionLimit: 10,
        waitForConnections: true,
        queueLimit: 0,
        enableKeepAlive: true,
        decimalNumbers: true,
    },
});
exports.typeOrmConfig = typeOrmConfig;
//# sourceMappingURL=typeorm.config.js.map