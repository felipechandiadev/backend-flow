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
exports.SuppliersRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const supplier_entity_1 = require("../domain/supplier.entity");
let SuppliersRepository = class SuppliersRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async findAll(options) {
        return this.repository.find(options);
    }
    async findOne(id) {
        return this.repository.findOne({
            where: { id },
            relations: ['person'],
        });
    }
    async create(data) {
        const supplier = this.repository.create(data);
        return this.repository.save(supplier);
    }
    async update(id, data) {
        await this.repository.update(id, data);
        const updated = await this.findOne(id);
        if (!updated) {
            throw new Error(`Supplier ${id} not found after update`);
        }
        return updated;
    }
    async remove(id) {
        await this.repository.softDelete(id);
    }
    async count(options) {
        return this.repository.count(options);
    }
};
exports.SuppliersRepository = SuppliersRepository;
exports.SuppliersRepository = SuppliersRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SuppliersRepository);
//# sourceMappingURL=suppliers.repository.js.map