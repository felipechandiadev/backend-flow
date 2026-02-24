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
exports.GoldPriceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gold_price_entity_1 = require("../../modules/gold-prices/domain/gold-price.entity");
let GoldPriceService = class GoldPriceService {
    constructor(goldPriceRepository) {
        this.goldPriceRepository = goldPriceRepository;
    }
    async getGoldPrices() {
        try {
            const prices = await this.goldPriceRepository.find({ order: { date: 'DESC' } });
            const result = prices.map(p => ({
                id: p.id,
                date: p.date.toISOString(),
                valueCLP: Number(p.valueCLP),
                notes: p.notes,
                metal: p.metal,
            }));
            console.log('GoldPriceService - getGoldPrices result:', result);
            return result;
        }
        catch (err) {
            console.error('GoldPriceService - Error getting prices:', err);
            return [];
        }
    }
    async saveGoldPrice(data) {
        try {
            let entity;
            if (data.id) {
                const found = await this.goldPriceRepository.findOneBy({ id: data.id });
                if (!found)
                    return { success: false, error: 'Registro no encontrado' };
                entity = found;
            }
            else {
                entity = this.goldPriceRepository.create();
            }
            entity.date = new Date(data.date);
            entity.valueCLP = data.valueCLP;
            entity.notes = data.notes;
            entity.metal = data.metal;
            await this.goldPriceRepository.save(entity);
            return { success: true };
        }
        catch (err) {
            console.error('GoldPriceService - Error saving price:', err);
            return { success: false, error: String(err) };
        }
    }
};
exports.GoldPriceService = GoldPriceService;
exports.GoldPriceService = GoldPriceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gold_price_entity_1.GoldPrice)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GoldPriceService);
//# sourceMappingURL=GoldPriceService.js.map