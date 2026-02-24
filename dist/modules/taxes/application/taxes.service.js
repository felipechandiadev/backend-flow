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
exports.TaxesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tax_entity_1 = require("../domain/tax.entity");
let TaxesService = class TaxesService {
    constructor(taxRepository) {
        this.taxRepository = taxRepository;
    }
    async getAllTaxes(includeInactive, isActive) {
        const query = this.taxRepository.createQueryBuilder('tax');
        if (typeof isActive === 'boolean') {
            query.where('tax.isActive = :isActive', { isActive });
        }
        else if (!includeInactive) {
            query.where('tax.isActive = :isActive', { isActive: true });
        }
        const taxes = await query.orderBy('tax.name', 'ASC').getMany();
        return taxes.map((tax) => this.mapTax(tax));
    }
    async getTaxById(id) {
        const tax = await this.taxRepository.findOne({ where: { id } });
        if (!tax) {
            return null;
        }
        return this.mapTax(tax);
    }
    async createTax(data) {
        const tax = this.taxRepository.create({
            companyId: data.companyId,
            name: data.name,
            code: data.code,
            taxType: data.taxType ?? tax_entity_1.TaxType.IVA,
            rate: data.rate,
            description: data.description ?? undefined,
            isDefault: !!data.isDefault,
            isActive: data.isActive !== false,
        });
        const saved = await this.taxRepository.save(tax);
        const created = await this.getTaxById(saved.id);
        return { success: true, tax: created };
    }
    async updateTax(id, data) {
        const updateData = { ...data };
        if (updateData.taxType) {
            updateData.taxType = updateData.taxType;
        }
        await this.taxRepository.update(id, updateData);
        const updated = await this.getTaxById(id);
        if (!updated) {
            return { success: false, message: 'Tax not found', statusCode: 404 };
        }
        return { success: true, tax: updated };
    }
    async deleteTax(id) {
        const result = await this.taxRepository.softDelete(id);
        if (!result.affected) {
            return { success: false, message: 'Tax not found', statusCode: 404 };
        }
        return { success: true };
    }
    mapTax(tax) {
        return {
            id: tax.id,
            companyId: tax.companyId,
            name: tax.name,
            code: tax.code,
            taxType: tax.taxType,
            rate: Number(tax.rate),
            description: tax.description ?? null,
            isDefault: tax.isDefault,
            isActive: tax.isActive,
            createdAt: tax.createdAt,
            updatedAt: tax.updatedAt,
        };
    }
};
exports.TaxesService = TaxesService;
exports.TaxesService = TaxesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tax_entity_1.Tax)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TaxesService);
//# sourceMappingURL=taxes.service.js.map