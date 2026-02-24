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
exports.GoldPricesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gold_price_entity_1 = require("../domain/gold-price.entity");
let GoldPricesService = class GoldPricesService {
    constructor(goldPriceRepository) {
        this.goldPriceRepository = goldPriceRepository;
    }
    async findAll() {
        const prices = await this.goldPriceRepository.find({
            order: { date: 'DESC' },
        });
        return {
            success: true,
            data: prices.map(p => ({
                id: p.id,
                date: p.date.toISOString(),
                valueCLP: Number(p.valueCLP),
                notes: p.notes,
                metal: p.metal,
            })),
        };
    }
    async findOne(id) {
        const price = await this.goldPriceRepository.findOne({ where: { id } });
        if (!price) {
            throw new common_1.NotFoundException('Precio de oro no encontrado');
        }
        return {
            success: true,
            data: {
                id: price.id,
                date: price.date.toISOString(),
                valueCLP: Number(price.valueCLP),
                notes: price.notes,
                metal: price.metal,
            },
        };
    }
    async create(createDto) {
        const price = this.goldPriceRepository.create({
            date: new Date(createDto.date),
            valueCLP: createDto.valueCLP,
            metal: createDto.metal,
            notes: createDto.notes,
        });
        const saved = await this.goldPriceRepository.save(price);
        return {
            success: true,
            data: {
                id: saved.id,
                date: saved.date.toISOString(),
                valueCLP: Number(saved.valueCLP),
                notes: saved.notes,
                metal: saved.metal,
            },
        };
    }
    async update(id, updateDto) {
        const price = await this.goldPriceRepository.findOne({ where: { id } });
        if (!price) {
            throw new common_1.NotFoundException('Precio de oro no encontrado');
        }
        if (updateDto.date)
            price.date = new Date(updateDto.date);
        if (updateDto.valueCLP !== undefined)
            price.valueCLP = updateDto.valueCLP;
        if (updateDto.metal)
            price.metal = updateDto.metal;
        if (updateDto.notes !== undefined)
            price.notes = updateDto.notes;
        const saved = await this.goldPriceRepository.save(price);
        return {
            success: true,
            data: {
                id: saved.id,
                date: saved.date.toISOString(),
                valueCLP: Number(saved.valueCLP),
                notes: saved.notes,
                metal: saved.metal,
            },
        };
    }
    async remove(id) {
        const price = await this.goldPriceRepository.findOne({ where: { id } });
        if (!price) {
            throw new common_1.NotFoundException('Precio de oro no encontrado');
        }
        await this.goldPriceRepository.remove(price);
        return {
            success: true,
            message: 'Precio de oro eliminado',
        };
    }
};
exports.GoldPricesService = GoldPricesService;
exports.GoldPricesService = GoldPricesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gold_price_entity_1.GoldPrice)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GoldPricesService);
//# sourceMappingURL=gold-prices.service.js.map