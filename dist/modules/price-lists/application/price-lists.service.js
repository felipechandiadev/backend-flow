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
exports.PriceListsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const price_list_entity_1 = require("../domain/price-list.entity");
let PriceListsService = class PriceListsService {
    constructor(priceListRepository) {
        this.priceListRepository = priceListRepository;
    }
    async getAllPriceLists(includeInactive) {
        const query = this.priceListRepository.createQueryBuilder('priceList');
        if (!includeInactive) {
            query.where('priceList.isActive = :isActive', { isActive: true });
        }
        const priceLists = await query.orderBy('priceList.priority', 'ASC').addOrderBy('priceList.name', 'ASC').getMany();
        return priceLists.map((priceList) => this.mapPriceList(priceList));
    }
    async getPriceListById(id) {
        const priceList = await this.priceListRepository.findOne({ where: { id } });
        if (!priceList) {
            return null;
        }
        return this.mapPriceList(priceList);
    }
    async createPriceList(data) {
        const priceList = this.priceListRepository.create({
            name: data.name,
            priceListType: data.priceListType,
            currency: data.currency ?? 'CLP',
            validFrom: data.validFrom ? new Date(data.validFrom) : undefined,
            validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
            priority: data.priority ?? 0,
            isDefault: !!data.isDefault,
            isActive: data.isActive !== false,
            description: data.description ?? undefined,
        });
        const saved = await this.priceListRepository.save(priceList);
        const created = await this.getPriceListById(saved.id);
        return { success: true, priceList: created };
    }
    async updatePriceList(id, data) {
        const updateData = { ...data };
        if (updateData.priceListType) {
            updateData.priceListType = updateData.priceListType;
        }
        if (updateData.validFrom) {
            updateData.validFrom = new Date(updateData.validFrom);
        }
        if (updateData.validUntil) {
            updateData.validUntil = new Date(updateData.validUntil);
        }
        await this.priceListRepository.update(id, updateData);
        const updated = await this.getPriceListById(id);
        if (!updated) {
            return { success: false, message: 'Price list not found', statusCode: 404 };
        }
        return { success: true, priceList: updated };
    }
    async deletePriceList(id) {
        const result = await this.priceListRepository.softDelete(id);
        if (!result.affected) {
            return { success: false, message: 'Price list not found', statusCode: 404 };
        }
        return { success: true };
    }
    mapPriceList(priceList) {
        return {
            id: priceList.id,
            name: priceList.name,
            priceListType: priceList.priceListType,
            currency: priceList.currency,
            validFrom: priceList.validFrom,
            validUntil: priceList.validUntil,
            priority: priceList.priority,
            isDefault: priceList.isDefault,
            isActive: priceList.isActive,
            description: priceList.description ?? null,
            createdAt: priceList.createdAt,
            updatedAt: priceList.updatedAt,
        };
    }
};
exports.PriceListsService = PriceListsService;
exports.PriceListsService = PriceListsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(price_list_entity_1.PriceList)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PriceListsService);
//# sourceMappingURL=price-lists.service.js.map