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
exports.UnitsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const unit_entity_1 = require("../domain/unit.entity");
let UnitsService = class UnitsService {
    constructor(unitRepository) {
        this.unitRepository = unitRepository;
    }
    async getAllUnits(status) {
        try {
            const query = this.unitRepository.createQueryBuilder('unit');
            if (status === 'active') {
                query.where('unit.active = :active', { active: true });
            }
            else if (status === 'inactive') {
                query.where('unit.active = :active', { active: false });
            }
            const units = await query.orderBy('unit.symbol', 'ASC').getMany();
            return units.map(unit => ({
                id: unit.id,
                name: unit.name,
                symbol: unit.symbol,
                dimension: unit.dimension,
                conversionFactor: unit.conversionFactor,
                allowDecimals: unit.allowDecimals,
                isBase: unit.isBase,
                active: unit.active,
                createdAt: unit.createdAt,
                updatedAt: unit.updatedAt,
            }));
        }
        catch (error) {
            console.error('Error fetching units:', error);
            return [];
        }
    }
    async getUnitById(id) {
        try {
            const unit = await this.unitRepository.findOne({
                where: { id },
            });
            if (!unit) {
                return null;
            }
            return {
                id: unit.id,
                name: unit.name,
                symbol: unit.symbol,
                dimension: unit.dimension,
                conversionFactor: unit.conversionFactor,
                allowDecimals: unit.allowDecimals,
                isBase: unit.isBase,
                active: unit.active,
                createdAt: unit.createdAt,
                updatedAt: unit.updatedAt,
            };
        }
        catch (error) {
            console.error('Error fetching unit:', error);
            return null;
        }
    }
    async createUnit(data) {
        try {
            const unit = this.unitRepository.create({
                name: data.name,
                symbol: data.symbol,
                dimension: data.dimension,
                conversionFactor: data.conversionFactor,
                allowDecimals: data.allowDecimals ?? true,
                isBase: data.isBase ?? false,
                active: true,
            });
            const savedUnit = await this.unitRepository.save(unit);
            return {
                id: savedUnit.id,
                name: savedUnit.name,
                symbol: savedUnit.symbol,
                dimension: savedUnit.dimension,
                conversionFactor: savedUnit.conversionFactor,
                allowDecimals: savedUnit.allowDecimals,
                isBase: savedUnit.isBase,
                active: savedUnit.active,
                createdAt: savedUnit.createdAt,
                updatedAt: savedUnit.updatedAt,
            };
        }
        catch (error) {
            console.error('Error creating unit:', error);
            throw error;
        }
    }
    async updateUnit(id, data) {
        try {
            const updateData = { ...data };
            if (updateData.dimension) {
                updateData.dimension = updateData.dimension;
            }
            await this.unitRepository.update(id, updateData);
            return this.getUnitById(id);
        }
        catch (error) {
            console.error('Error updating unit:', error);
            throw error;
        }
    }
    async deleteUnit(id) {
        try {
            await this.unitRepository.softDelete(id);
            return { success: true };
        }
        catch (error) {
            console.error('Error deleting unit:', error);
            throw error;
        }
    }
};
exports.UnitsService = UnitsService;
exports.UnitsService = UnitsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(unit_entity_1.Unit)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UnitsService);
//# sourceMappingURL=units.service.js.map