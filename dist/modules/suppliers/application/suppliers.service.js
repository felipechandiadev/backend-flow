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
var SuppliersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const suppliers_repository_1 = require("../infrastructure/suppliers.repository");
let SuppliersService = SuppliersService_1 = class SuppliersService {
    constructor(repository) {
        this.repository = repository;
        this.logger = new common_1.Logger(SuppliersService_1.name);
    }
    async findAll(params) {
        const { limit = 50, offset = 0, isActive, supplierType } = params || {};
        const where = {};
        if (isActive !== undefined)
            where.isActive = isActive;
        if (supplierType)
            where.supplierType = supplierType;
        const [data, total] = await Promise.all([
            this.repository.findAll({
                where,
                take: limit,
                skip: offset,
                relations: ['person'],
                order: { createdAt: 'DESC' },
            }),
            this.repository.count({ where }),
        ]);
        return { data, total };
    }
    async findOne(id) {
        const supplier = await this.repository.findOne(id);
        if (!supplier) {
            throw new common_1.NotFoundException(`Supplier ${id} not found`);
        }
        return supplier;
    }
    async create(dto) {
        this.logger.log(`Creating supplier for person ${dto.personId}`);
        return this.repository.create(dto);
    }
    async update(id, dto) {
        const supplier = await this.findOne(id);
        this.logger.log(`Updating supplier ${id}`);
        return this.repository.update(id, dto);
    }
    async remove(id) {
        const supplier = await this.findOne(id);
        this.logger.log(`Removing supplier ${id}`);
        await this.repository.remove(id);
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = SuppliersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [suppliers_repository_1.SuppliersRepository])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map