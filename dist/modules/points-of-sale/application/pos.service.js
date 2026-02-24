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
exports.PosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const point_of_sale_entity_1 = require("../domain/point-of-sale.entity");
let PosService = class PosService {
    constructor(posRepository) {
        this.posRepository = posRepository;
    }
    async findAll(includeInactive) {
        const query = this.posRepository
            .createQueryBuilder('pos')
            .leftJoinAndSelect('pos.branch', 'branch')
            .where('pos.deletedAt IS NULL')
            .orderBy('pos.name', 'ASC');
        if (!includeInactive) {
            query.andWhere('pos.isActive = :isActive', { isActive: true });
        }
        const pointsOfSale = await query.getMany();
        return {
            success: true,
            pointsOfSale: pointsOfSale.map((pos) => this.mapPointOfSale(pos)),
        };
    }
    async getPointOfSaleById(id) {
        const pos = await this.posRepository.findOne({
            where: { id, deletedAt: (0, typeorm_2.IsNull)() },
            relations: { branch: true },
        });
        if (!pos) {
            return null;
        }
        return this.mapPointOfSale(pos);
    }
    async createPointOfSale(data) {
        if (!data.name || !data.name.trim()) {
            return { success: false, error: 'El nombre es requerido' };
        }
        const priceLists = Array.isArray(data.priceLists) ? data.priceLists : [];
        const defaultPriceListId = data.defaultPriceListId ?? (priceLists.length > 0 ? priceLists[0].id : undefined);
        const pos = this.posRepository.create({
            name: data.name.trim(),
            branchId: data.branchId ?? undefined,
            deviceId: data.deviceId ?? undefined,
            isActive: data.isActive !== false,
            priceLists,
            defaultPriceListId,
        });
        const saved = await this.posRepository.save(pos);
        const created = await this.getPointOfSaleById(saved.id);
        return { success: true, pointOfSale: created };
    }
    async updatePointOfSale(id, data) {
        const pos = await this.posRepository.findOne({ where: { id, deletedAt: (0, typeorm_2.IsNull)() } });
        if (!pos) {
            return { success: false, error: 'Punto de venta no encontrado' };
        }
        const updateData = {};
        if (typeof data.name === 'string') {
            updateData.name = data.name.trim();
        }
        if (data.branchId !== undefined) {
            updateData.branchId = data.branchId ?? undefined;
        }
        if (data.deviceId !== undefined) {
            updateData.deviceId = data.deviceId ?? undefined;
        }
        if (data.isActive !== undefined) {
            updateData.isActive = data.isActive;
        }
        if (data.priceLists !== undefined) {
            updateData.priceLists = data.priceLists;
        }
        if (data.defaultPriceListId !== undefined) {
            updateData.defaultPriceListId = data.defaultPriceListId ?? undefined;
        }
        await this.posRepository.update(id, updateData);
        const updated = await this.getPointOfSaleById(id);
        return { success: true, pointOfSale: updated };
    }
    async getPriceLists(id) {
        const pos = await this.posRepository.findOne({ where: { id } });
        if (!pos) {
            return { success: false, message: 'Punto de venta no encontrado', priceLists: [] };
        }
        return {
            success: true,
            priceLists: pos.priceLists ?? [],
        };
    }
    async deletePointOfSale(id) {
        const result = await this.posRepository.softDelete(id);
        if (!result.affected) {
            return { success: false, error: 'Punto de venta no encontrado' };
        }
        return { success: true };
    }
    mapPointOfSale(pos) {
        return {
            id: pos.id,
            name: pos.name,
            branchId: pos.branchId,
            branch: pos.branch
                ? {
                    id: pos.branch.id,
                    name: pos.branch.name,
                }
                : undefined,
            priceLists: pos.priceLists ?? [],
            deviceId: pos.deviceId,
            isActive: pos.isActive,
            defaultPriceListId: pos.defaultPriceListId ?? null,
            createdAt: pos.createdAt,
            updatedAt: pos.updatedAt,
        };
    }
};
exports.PosService = PosService;
exports.PosService = PosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(point_of_sale_entity_1.PointOfSale)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PosService);
//# sourceMappingURL=pos.service.js.map