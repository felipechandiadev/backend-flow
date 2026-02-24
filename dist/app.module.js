"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const path = require("path");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const typeorm_config_1 = require("./config/typeorm.config");
const app_controller_1 = require("./app.controller");
const events_module_1 = require("./shared/events/events.module");
const cache_module_1 = require("./shared/cache/cache.module");
const health_module_1 = require("./modules/health/health.module");
const pos_module_1 = require("./modules/points-of-sale/pos.module");
const auth_module_1 = require("./modules/auth/auth.module");
const cash_sessions_module_1 = require("./modules/cash-sessions/cash-sessions.module");
const treasury_accounts_module_1 = require("./modules/treasury-accounts/treasury-accounts.module");
const customers_module_1 = require("./modules/customers/customers.module");
const products_module_1 = require("./modules/products/products.module");
const payments_module_1 = require("./modules/payments/payments.module");
const transactions_module_1 = require("./modules/transactions/transactions.module");
const gold_prices_module_1 = require("./modules/gold-prices/gold-prices.module");
const audits_module_1 = require("./modules/audits/audits.module");
const accounting_module_1 = require("./modules/accounting/accounting.module");
const categories_module_1 = require("./modules/categories/categories.module");
const seed_module_1 = require("./seed/seed.module");
const companies_module_1 = require("./modules/companies/companies.module");
const shareholders_module_1 = require("./modules/shareholders/shareholders.module");
const units_module_1 = require("./modules/units/units.module");
const branches_module_1 = require("./modules/branches/branches.module");
const storages_module_1 = require("./modules/storages/storages.module");
const price_lists_module_1 = require("./modules/price-lists/price-lists.module");
const users_module_1 = require("./modules/users/users.module");
const taxes_module_1 = require("./modules/taxes/taxes.module");
const attributes_module_1 = require("./modules/attributes/attributes.module");
const bank_movements_module_1 = require("./modules/bank-movements/bank-movements.module");
const bank_accounts_module_1 = require("./modules/bank-accounts/bank-accounts.module");
const capital_contributions_module_1 = require("./modules/capital-contributions/capital-contributions.module");
const bank_transfers_module_1 = require("./modules/bank-transfers/bank-transfers.module");
const bank_withdrawals_module_1 = require("./modules/bank-withdrawals/bank-withdrawals.module");
const cash_deposits_module_1 = require("./modules/cash-deposits/cash-deposits.module");
const employees_module_1 = require("./modules/employees/employees.module");
const result_centers_module_1 = require("./modules/result-centers/result-centers.module");
const organizational_units_module_1 = require("./modules/organizational-units/organizational-units.module");
const remunerations_module_1 = require("./modules/remunerations/remunerations.module");
const persons_module_1 = require("./modules/persons/persons.module");
const accounting_periods_module_1 = require("./modules/accounting-periods/accounting-periods.module");
const account_balances_module_1 = require("./modules/account-balances/account-balances.module");
const operational_expenses_module_1 = require("./modules/operational-expenses/operational-expenses.module");
const expense_categories_module_1 = require("./modules/expense-categories/expense-categories.module");
const suppliers_module_1 = require("./modules/suppliers/suppliers.module");
const receptions_module_1 = require("./modules/receptions/receptions.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const installments_module_1 = require("./modules/installments/installments.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: path.resolve(__dirname, '..', `.env.${process.env.NODE_ENV || 'development'}`),
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: typeorm_config_1.typeOrmConfig,
                inject: [config_1.ConfigService],
            }),
            event_emitter_1.EventEmitterModule.forRoot(),
            events_module_1.EventsModule,
            cache_module_1.CacheModule,
            health_module_1.HealthModule,
            pos_module_1.PosModule,
            auth_module_1.AuthModule,
            companies_module_1.CompaniesModule,
            shareholders_module_1.ShareholdersModule,
            branches_module_1.BranchesModule,
            storages_module_1.StoragesModule,
            price_lists_module_1.PriceListsModule,
            users_module_1.UsersModule,
            taxes_module_1.TaxesModule,
            attributes_module_1.AttributesModule,
            bank_movements_module_1.BankMovementsModule,
            bank_accounts_module_1.BankAccountsModule,
            capital_contributions_module_1.CapitalContributionsModule,
            bank_transfers_module_1.BankTransfersModule,
            bank_withdrawals_module_1.BankWithdrawalsModule,
            cash_deposits_module_1.CashDepositsModule,
            employees_module_1.EmployeesModule,
            cash_sessions_module_1.CashSessionsModule,
            treasury_accounts_module_1.TreasuryAccountsModule,
            customers_module_1.CustomersModule,
            products_module_1.ProductsModule,
            payments_module_1.PaymentsModule,
            transactions_module_1.TransactionsModule,
            gold_prices_module_1.GoldPricesModule,
            audits_module_1.AuditsModule,
            accounting_module_1.AccountingModule,
            accounting_periods_module_1.AccountingPeriodsModule,
            account_balances_module_1.AccountBalancesModule,
            categories_module_1.CategoriesModule,
            result_centers_module_1.ResultCentersModule,
            organizational_units_module_1.OrganizationalUnitsModule,
            operational_expenses_module_1.OperationalExpensesModule,
            expense_categories_module_1.ExpenseCategoriesModule,
            suppliers_module_1.SuppliersModule,
            receptions_module_1.ReceptionsModule,
            inventory_module_1.InventoryModule,
            remunerations_module_1.RemunerationsModule,
            persons_module_1.PersonsModule,
            units_module_1.UnitsModule,
            (require('./modules/product-variants/product-variants.module').ProductVariantsModule),
            installments_module_1.InstallmentsModule,
            seed_module_1.SeedModule,
            (require('./modules/analytics/analytics.module').AnalyticsModule),
        ],
        controllers: [app_controller_1.AppController],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map