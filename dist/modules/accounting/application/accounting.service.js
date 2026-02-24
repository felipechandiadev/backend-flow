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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const AccountingEngine_1 = require("../../../shared/application/AccountingEngine");
const accounting_account_entity_1 = require("../../accounting-accounts/domain/accounting-account.entity");
const ledger_entry_entity_1 = require("../../ledger-entries/domain/ledger-entry.entity");
let AccountingService = class AccountingService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async getHierarchy(includeInactive) {
        const repository = this.dataSource.getRepository(accounting_account_entity_1.AccountingAccount);
        const query = repository.createQueryBuilder('account');
        if (!includeInactive) {
            query.where('account.isActive = :isActive', { isActive: true });
        }
        const accounts = await query.orderBy('account.code', 'ASC').getMany();
        const nodeMap = new Map();
        const roots = [];
        for (const account of accounts) {
            nodeMap.set(account.id, {
                id: account.id,
                code: account.code,
                name: account.name,
                type: account.type,
                parentId: account.parentId ?? null,
                isActive: account.isActive,
                balance: 0,
                children: [],
            });
        }
        for (const node of nodeMap.values()) {
            if (node.parentId && nodeMap.has(node.parentId)) {
                nodeMap.get(node.parentId).children.push(node);
            }
            else {
                roots.push(node);
            }
        }
        const sortTree = (nodes) => {
            nodes.sort((a, b) => a.code.localeCompare(b.code));
            for (const node of nodes) {
                if (node.children.length > 0) {
                    sortTree(node.children);
                }
            }
        };
        sortTree(roots);
        return roots;
    }
    async getLedgerData(includeInactive) {
        const repository = this.dataSource.getRepository(accounting_account_entity_1.AccountingAccount);
        const query = repository.createQueryBuilder('account');
        if (!includeInactive) {
            query.where('account.isActive = :isActive', { isActive: true });
        }
        const accounts = await query.orderBy('account.code', 'ASC').getMany();
        const ledgerRepo = this.dataSource.getRepository(ledger_entry_entity_1.LedgerEntry);
        const ledgerEntries = await ledgerRepo.find({
            relations: ['transaction', 'account'],
            order: { entryDate: 'DESC' },
        });
        const entries = (ledgerEntries || []).map((entry) => ({
            id: entry.id,
            transactionId: entry.transactionId,
            accountId: entry.accountId,
            accountCode: entry.account?.code,
            accountName: entry.account?.name,
            date: entry.entryDate,
            description: entry.description,
            debit: entry.debit,
            credit: entry.credit,
            reference: entry.transaction?.documentNumber || entry.transaction?.externalReference,
        }));
        return {
            entries: entries || [],
            accounts: accounts.map((account) => ({
                id: account.id,
                code: account.code,
                name: account.name,
            })),
        };
    }
    async buildLedger(dto) {
        const params = {
            companyId: dto.companyId,
        };
        if (dto.from)
            params.from = new Date(dto.from);
        if (dto.to)
            params.to = new Date(dto.to);
        if (dto.resultCenterId)
            params.resultCenterId = dto.resultCenterId;
        if (dto.limitTransactions)
            params.limitTransactions = dto.limitTransactions;
        const result = await (0, AccountingEngine_1.buildLedger)(this.dataSource, params);
        return {
            success: true,
            data: {
                accounts: result.accounts,
                postings: result.postings,
                balanceByAccount: result.balanceByAccount,
            },
        };
    }
};
exports.AccountingService = AccountingService;
exports.AccountingService = AccountingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AccountingService);
//# sourceMappingURL=accounting.service.js.map