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
exports.AttributesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attribute_entity_1 = require("../domain/attribute.entity");
let AttributesService = class AttributesService {
    constructor(attributeRepository) {
        this.attributeRepository = attributeRepository;
    }
    async getAllAttributes(includeInactive) {
        const query = this.attributeRepository.createQueryBuilder('attribute');
        if (!includeInactive) {
            query.where('attribute.isActive = :isActive', { isActive: true });
        }
        const attributes = await query.orderBy('attribute.displayOrder', 'ASC').addOrderBy('attribute.name', 'ASC').getMany();
        return attributes.map((attribute) => this.mapAttribute(attribute));
    }
    async getAttributeById(id) {
        const attribute = await this.attributeRepository.findOne({ where: { id } });
        if (!attribute) {
            return null;
        }
        return this.mapAttribute(attribute);
    }
    async createAttribute(data) {
        const attribute = this.attributeRepository.create({
            name: data.name,
            description: data.description ?? undefined,
            options: data.options,
            isActive: true,
        });
        const saved = await this.attributeRepository.save(attribute);
        const created = await this.getAttributeById(saved.id);
        return { success: true, attribute: created };
    }
    async updateAttribute(id, data) {
        await this.attributeRepository.update(id, data);
        const updated = await this.getAttributeById(id);
        if (!updated) {
            return { success: false, message: 'Attribute not found', statusCode: 404 };
        }
        return { success: true, attribute: updated };
    }
    async deleteAttribute(id) {
        const result = await this.attributeRepository.softDelete(id);
        if (!result.affected) {
            return { success: false, message: 'Attribute not found', statusCode: 404 };
        }
        return { success: true };
    }
    mapAttribute(attribute) {
        return {
            id: attribute.id,
            name: attribute.name,
            description: attribute.description ?? null,
            options: attribute.options ?? [],
            displayOrder: attribute.displayOrder,
            isActive: attribute.isActive,
            createdAt: attribute.createdAt,
            updatedAt: attribute.updatedAt,
        };
    }
};
exports.AttributesService = AttributesService;
exports.AttributesService = AttributesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attribute_entity_1.Attribute)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AttributesService);
//# sourceMappingURL=attributes.service.js.map