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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingPeriodsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const accounting_period_entity_1 = require("../domain/accounting-period.entity");
const company_entity_1 = require("../../companies/domain/company.entity");
const account_balance_service_1 = require("../../account-balances/application/account-balance.service");
let AccountingPeriodsService = class AccountingPeriodsService {
    constructor(accountingPeriodRepository, companyRepository, accountBalanceService) {
        this.accountingPeriodRepository = accountingPeriodRepository;
        this.companyRepository = companyRepository;
        this.accountBalanceService = accountBalanceService;
    }
    async findAll(params) {
        const queryBuilder = this.accountingPeriodRepository
            .createQueryBuilder('period')
            .leftJoinAndSelect('period.company', 'company')
            .leftJoinAndSelect('period.closedByUser', 'closedByUser');
        if (params?.companyId) {
            queryBuilder.andWhere('period.companyId = :companyId', {
                companyId: params.companyId,
            });
        }
        if (params?.status) {
            queryBuilder.andWhere('period.status = :status', {
                status: params.status,
            });
        }
        if (params?.year) {
            const startOfYear = `${params.year}-01-01`;
            const endOfYear = `${params.year}-12-31`;
            queryBuilder.andWhere('period.startDate >= :startOfYear', { startOfYear });
            queryBuilder.andWhere('period.endDate <= :endOfYear', { endOfYear });
        }
        queryBuilder.orderBy('period.startDate', 'DESC');
        return await queryBuilder.getMany();
    }
    async findOne(id) {
        return await this.accountingPeriodRepository.findOne({
            where: { id },
            relations: ['company', 'closedByUser'],
        });
    }
    async create(data) {
        let companyId = data.companyId;
        if (!companyId) {
            const firstCompany = await this.companyRepository.findOne({
                where: {},
                order: { createdAt: 'ASC' },
            });
            if (!firstCompany) {
                throw new common_1.BadRequestException('No company found. Please create a company first.');
            }
            companyId = firstCompany.id;
        }
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        if (endDate < startDate) {
            throw new common_1.BadRequestException('End date must be after start date.');
        }
        const overlapping = await this.accountingPeriodRepository
            .createQueryBuilder('period')
            .where('period.companyId = :companyId', { companyId })
            .andWhere('(period.startDate BETWEEN :startDate AND :endDate OR period.endDate BETWEEN :startDate AND :endDate OR (:startDate BETWEEN period.startDate AND period.endDate))', {
            startDate: data.startDate,
            endDate: data.endDate,
        })
            .getOne();
        if (overlapping) {
            throw new common_1.BadRequestException(`Period overlaps with existing period: ${overlapping.name || overlapping.id}`);
        }
        const period = this.accountingPeriodRepository.create({
            companyId,
            startDate: data.startDate,
            endDate: data.endDate,
            name: data.name,
            status: data.status || accounting_period_entity_1.AccountingPeriodStatus.OPEN,
        });
        return await this.accountingPeriodRepository.save(period);
    }
    async ensurePeriod(date, companyId) {
        let resolvedCompanyId = companyId;
        if (!resolvedCompanyId) {
            const firstCompany = await this.companyRepository.findOne({
                where: {},
                order: { createdAt: 'ASC' },
            });
            if (!firstCompany) {
                throw new common_1.BadRequestException('No company found. Please create a company first.');
            }
            resolvedCompanyId = firstCompany.id;
        }
        const existing = await this.accountingPeriodRepository
            .createQueryBuilder('period')
            .where('period.companyId = :companyId', { companyId: resolvedCompanyId })
            .andWhere('period.startDate <= :date', { date })
            .andWhere('period.endDate >= :date', { date })
            .getOne();
        if (existing) {
            if (existing.status === accounting_period_entity_1.AccountingPeriodStatus.CLOSED) {
                throw new common_1.BadRequestException(`Cannot create transaction in closed period: ${existing.name} ` +
                    `(${existing.startDate} to ${existing.endDate}). ` +
                    `Please reopen the period or change the transaction date.`);
            }
            if (existing.status === accounting_period_entity_1.AccountingPeriodStatus.LOCKED) {
                throw new common_1.BadRequestException(`Period is locked: ${existing.name}. Cannot create transactions.`);
            }
            return existing;
        }
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth();
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        const period = this.accountingPeriodRepository.create({
            companyId: resolvedCompanyId,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            name: `${monthNames[month]} ${year}`,
            status: accounting_period_entity_1.AccountingPeriodStatus.OPEN,
        });
        return await this.accountingPeriodRepository.save(period);
    }
    async closePeriod(id, userId) {
        const period = await this.findOne(id);
        if (!period) {
            throw new common_1.BadRequestException('Period not found.');
        }
        if (period.status === accounting_period_entity_1.AccountingPeriodStatus.CLOSED) {
            throw new common_1.BadRequestException('Period is already closed.');
        }
        if (period.status === accounting_period_entity_1.AccountingPeriodStatus.LOCKED) {
            throw new common_1.BadRequestException('Period is locked and cannot be closed.');
        }
        await this.accountBalanceService.freezeBalancesForPeriod(id);
        period.status = accounting_period_entity_1.AccountingPeriodStatus.CLOSED;
        period.closedAt = new Date();
        period.closedBy = userId || null;
        return await this.accountingPeriodRepository.save(period);
    }
    async reopenPeriod(id) {
        const period = await this.findOne(id);
        if (!period) {
            throw new common_1.BadRequestException('Period not found.');
        }
        if (period.status === accounting_period_entity_1.AccountingPeriodStatus.LOCKED) {
            throw new common_1.BadRequestException('Period is locked and cannot be reopened.');
        }
        period.status = accounting_period_entity_1.AccountingPeriodStatus.OPEN;
        period.closedAt = null;
        period.closedBy = null;
        return await this.accountingPeriodRepository.save(period);
    }
};
exports.AccountingPeriodsService = AccountingPeriodsService;
exports.AccountingPeriodsService = AccountingPeriodsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(accounting_period_entity_1.AccountingPeriod)),
    __param(1, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        account_balance_service_1.AccountBalanceService])
], AccountingPeriodsService);
//# sourceMappingURL=accounting-periods.service.js.map