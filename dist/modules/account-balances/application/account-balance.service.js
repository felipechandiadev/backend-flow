"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AccountBalanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountBalanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const account_balance_entity_1 = require("../domain/account-balance.entity");
const ledger_entry_entity_1 = require("../../ledger-entries/domain/ledger-entry.entity");
const accounting_period_entity_1 = require("../../accounting-periods/domain/accounting-period.entity");
let AccountBalanceService = AccountBalanceService_1 = class AccountBalanceService {
    constructor(balanceRepository, ledgerRepository, periodRepository, dataSource) {
        this.balanceRepository = balanceRepository;
        this.ledgerRepository = ledgerRepository;
        this.periodRepository = periodRepository;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(AccountBalanceService_1.name);
    }
    async updateBalancesForLedgerEntries(ledgerEntries) {
        if (!ledgerEntries || ledgerEntries.length === 0) {
            return;
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const groupedEntries = new Map();
            for (const entry of ledgerEntries) {
                const transaction = await queryRunner.manager
                    .createQueryBuilder()
                    .select(['t.id', 't.periodId', 't.companyId'])
                    .from('transactions', 't')
                    .where('t.id = :transactionId', { transactionId: entry.transactionId })
                    .getRawOne();
                if (!transaction || !transaction.periodId) {
                    this.logger.warn(`Transaction ${entry.transactionId} has no period, skipping balance update`);
                    continue;
                }
                const key = `${entry.accountId}-${transaction.periodId}`;
                const existing = groupedEntries.get(key);
                if (existing) {
                    existing.totalDebit += Number(entry.debit);
                    existing.totalCredit += Number(entry.credit);
                }
                else {
                    groupedEntries.set(key, {
                        accountId: entry.accountId,
                        periodId: transaction.periodId,
                        companyId: transaction.companyId,
                        totalDebit: Number(entry.debit),
                        totalCredit: Number(entry.credit),
                    });
                }
            }
            for (const [, group] of groupedEntries) {
                let balance = await queryRunner.manager.findOne(account_balance_entity_1.AccountBalance, {
                    where: {
                        accountId: group.accountId,
                        periodId: group.periodId,
                    },
                });
                if (balance) {
                    if (balance.frozen) {
                        this.logger.error(`Cannot update balance for frozen period ${group.periodId}`);
                        throw new Error(`Period is closed and frozen. Cannot modify balances.`);
                    }
                    balance.periodDebit = Number(balance.periodDebit) + group.totalDebit;
                    balance.periodCredit = Number(balance.periodCredit) + group.totalCredit;
                    balance.closingDebit = Number(balance.openingDebit) + Number(balance.periodDebit);
                    balance.closingCredit = Number(balance.openingCredit) + Number(balance.periodCredit);
                    await queryRunner.manager.save(balance);
                }
                else {
                    balance = queryRunner.manager.create(account_balance_entity_1.AccountBalance, {
                        companyId: group.companyId,
                        accountId: group.accountId,
                        periodId: group.periodId,
                        openingDebit: 0,
                        openingCredit: 0,
                        periodDebit: group.totalDebit,
                        periodCredit: group.totalCredit,
                        closingDebit: group.totalDebit,
                        closingCredit: group.totalCredit,
                        frozen: false,
                    });
                    await queryRunner.manager.save(balance);
                }
                this.logger.log(`Updated balance for account ${group.accountId} period ${group.periodId}: +${group.totalDebit} debit, +${group.totalCredit} credit`);
            }
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to update account balances: ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async freezeBalancesForPeriod(periodId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const balances = await queryRunner.manager.find(account_balance_entity_1.AccountBalance, {
                where: { periodId },
            });
            if (balances.length === 0) {
                this.logger.warn(`No balances found for period ${periodId}`);
                await queryRunner.commitTransaction();
                return;
            }
            for (const balance of balances) {
                balance.frozen = true;
                balance.frozenAt = new Date();
                balance.closingDebit = Number(balance.openingDebit) + Number(balance.periodDebit);
                balance.closingCredit = Number(balance.openingCredit) + Number(balance.periodCredit);
                await queryRunner.manager.save(balance);
            }
            this.logger.log(`Frozen ${balances.length} balances for period ${periodId}`);
            const closedPeriod = await queryRunner.manager.findOne(accounting_period_entity_1.AccountingPeriod, {
                where: { id: periodId },
            });
            if (closedPeriod) {
                const nextPeriod = await queryRunner.manager
                    .createQueryBuilder(accounting_period_entity_1.AccountingPeriod, 'ap')
                    .where('ap.companyId = :companyId', { companyId: closedPeriod.companyId })
                    .andWhere('ap.startDate > :endDate', { endDate: closedPeriod.endDate })
                    .orderBy('ap.startDate', 'ASC')
                    .getOne();
                if (nextPeriod) {
                    await this.carryForwardBalances(closedPeriod.id, nextPeriod.id, queryRunner);
                }
            }
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to freeze balances for period: ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async carryForwardBalances(fromPeriodId, toPeriodId, queryRunner) {
        const closingBalances = await queryRunner.manager.find(account_balance_entity_1.AccountBalance, {
            where: { periodId: fromPeriodId },
        });
        for (const closingBalance of closingBalances) {
            let nextBalance = await queryRunner.manager.findOne(account_balance_entity_1.AccountBalance, {
                where: {
                    accountId: closingBalance.accountId,
                    periodId: toPeriodId,
                },
            });
            if (nextBalance) {
                nextBalance.openingDebit = closingBalance.closingDebit;
                nextBalance.openingCredit = closingBalance.closingCredit;
                nextBalance.closingDebit = Number(nextBalance.openingDebit) + Number(nextBalance.periodDebit);
                nextBalance.closingCredit = Number(nextBalance.openingCredit) + Number(nextBalance.periodCredit);
                await queryRunner.manager.save(nextBalance);
            }
            else {
                nextBalance = queryRunner.manager.create(account_balance_entity_1.AccountBalance, {
                    companyId: closingBalance.companyId,
                    accountId: closingBalance.accountId,
                    periodId: toPeriodId,
                    openingDebit: closingBalance.closingDebit,
                    openingCredit: closingBalance.closingCredit,
                    periodDebit: 0,
                    periodCredit: 0,
                    closingDebit: closingBalance.closingDebit,
                    closingCredit: closingBalance.closingCredit,
                    frozen: false,
                });
                await queryRunner.manager.save(nextBalance);
            }
        }
        this.logger.log(`Carried forward ${closingBalances.length} balances from period ${fromPeriodId} to ${toPeriodId}`);
    }
    async getBalancesForPeriod(companyId, periodId) {
        return this.balanceRepository.find({
            where: { companyId, periodId },
            relations: ['account'],
            order: { account: { code: 'ASC' } },
        });
    }
    async recalculateBalancesForPeriod(periodId) {
        this.logger.warn(`Recalculating balances for period ${periodId} - this may take a while`);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.delete(account_balance_entity_1.AccountBalance, { periodId });
            const result = await queryRunner.manager.query(`
                INSERT INTO account_balances (
                    id, companyId, accountId, periodId,
                    openingDebit, openingCredit,
                    periodDebit, periodCredit,
                    closingDebit, closingCredit,
                    frozen
                )
                SELECT 
                    UUID() as id,
                    t.companyId,
                    le.accountId,
                    t.periodId,
                    0 as openingDebit,
                    0 as openingCredit,
                    SUM(le.debit) as periodDebit,
                    SUM(le.credit) as periodCredit,
                    SUM(le.debit) as closingDebit,
                    SUM(le.credit) as closingCredit,
                    FALSE as frozen
                FROM ledger_entries le
                INNER JOIN transactions t ON le.transactionId = t.id
                WHERE t.periodId = ?
                GROUP BY t.companyId, le.accountId, t.periodId
            `, [periodId]);
            await queryRunner.commitTransaction();
            this.logger.log(`Recalculated balances for period ${periodId}: ${result.affectedRows} balances created`);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to recalculate balances: ${error.message}`, error.stack);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.AccountBalanceService = AccountBalanceService;
exports.AccountBalanceService = AccountBalanceService = AccountBalanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(account_balance_entity_1.AccountBalance)),
    __param(1, (0, typeorm_1.InjectRepository)(ledger_entry_entity_1.LedgerEntry)),
    __param(2, (0, typeorm_1.InjectRepository)(accounting_period_entity_1.AccountingPeriod)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], AccountBalanceService);
//# sourceMappingURL=account-balance.service.js.map