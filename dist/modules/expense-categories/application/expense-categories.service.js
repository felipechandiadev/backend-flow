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
var ExpenseCategoriesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseCategoriesService = void 0;
const common_1 = require("@nestjs/common");
const expense_categories_repository_1 = require("../infrastructure/expense-categories.repository");
let ExpenseCategoriesService = ExpenseCategoriesService_1 = class ExpenseCategoriesService {
    constructor(repository) {
        this.repository = repository;
        this.logger = new common_1.Logger(ExpenseCategoriesService_1.name);
    }
    async findAll(params) {
        const { limit = 50, offset = 0, companyId, isActive } = params || {};
        const where = {};
        if (companyId)
            where.companyId = companyId;
        if (isActive !== undefined)
            where.isActive = isActive;
        const [data, total] = await Promise.all([
            this.repository.findAll({
                where,
                take: limit,
                skip: offset,
                relations: ['company', 'defaultResultCenter'],
                order: { createdAt: 'DESC' },
            }),
            this.repository.count({ where }),
        ]);
        return { data, total };
    }
    async findOne(id) {
        const category = await this.repository.findOne(id);
        if (!category) {
            throw new common_1.NotFoundException(`Expense category ${id} not found`);
        }
        return category;
    }
    async create(dto) {
        this.logger.log(`Creating expense category: ${dto.name}`);
        const data = { ...dto };
        if (dto.approvalThreshold !== undefined) {
            data.approvalThreshold = dto.approvalThreshold.toString();
        }
        return this.repository.create(data);
    }
    async update(id, dto) {
        const category = await this.findOne(id);
        this.logger.log(`Updating expense category ${id}`);
        const data = { ...dto };
        if (dto.approvalThreshold !== undefined) {
            data.approvalThreshold = dto.approvalThreshold.toString();
        }
        return this.repository.update(id, data);
    }
    async remove(id) {
        const category = await this.findOne(id);
        this.logger.log(`Removing expense category ${id}`);
        await this.repository.remove(id);
    }
};
exports.ExpenseCategoriesService = ExpenseCategoriesService;
exports.ExpenseCategoriesService = ExpenseCategoriesService = ExpenseCategoriesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [expense_categories_repository_1.ExpenseCategoriesRepository])
], ExpenseCategoriesService);
//# sourceMappingURL=expense-categories.service.js.map