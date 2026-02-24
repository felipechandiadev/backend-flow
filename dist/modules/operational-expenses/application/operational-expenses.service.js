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
var OperationalExpensesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationalExpensesService = void 0;
const common_1 = require("@nestjs/common");
const operational_expenses_repository_1 = require("../infrastructure/operational-expenses.repository");
let OperationalExpensesService = OperationalExpensesService_1 = class OperationalExpensesService {
    constructor(repository) {
        this.repository = repository;
        this.logger = new common_1.Logger(OperationalExpensesService_1.name);
    }
    async findAll(params) {
        const { limit = 50, offset = 0, companyId, branchId, status } = params || {};
        const where = {};
        if (companyId)
            where.companyId = companyId;
        if (branchId)
            where.branchId = branchId;
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            this.repository.findAll({
                where,
                take: limit,
                skip: offset,
                relations: ['company', 'branch', 'resultCenter', 'category', 'supplier', 'employee'],
                order: { createdAt: 'DESC' },
            }),
            this.repository.count({ where }),
        ]);
        return { data, total };
    }
    async findOne(id) {
        const expense = await this.repository.findOne(id);
        if (!expense) {
            throw new common_1.NotFoundException(`Operational expense ${id} not found`);
        }
        return expense;
    }
    async create(dto) {
        this.logger.log(`Creating operational expense: ${dto.referenceNumber}`);
        return this.repository.create(dto);
    }
    async update(id, dto) {
        const expense = await this.findOne(id);
        this.logger.log(`Updating operational expense ${id}`);
        return this.repository.update(id, dto);
    }
    async remove(id) {
        const expense = await this.findOne(id);
        this.logger.log(`Removing operational expense ${id}`);
        await this.repository.remove(id);
    }
};
exports.OperationalExpensesService = OperationalExpensesService;
exports.OperationalExpensesService = OperationalExpensesService = OperationalExpensesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [operational_expenses_repository_1.OperationalExpensesRepository])
], OperationalExpensesService);
//# sourceMappingURL=operational-expenses.service.js.map