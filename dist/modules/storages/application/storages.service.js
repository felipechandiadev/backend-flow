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
exports.StoragesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const storage_entity_1 = require("../domain/storage.entity");
let StoragesService = class StoragesService {
    constructor(storageRepository) {
        this.storageRepository = storageRepository;
    }
    async getAllStorages(includeInactive) {
        const query = this.storageRepository
            .createQueryBuilder('storage')
            .leftJoinAndSelect('storage.branch', 'branch');
        if (!includeInactive) {
            query.where('storage.isActive = :isActive', { isActive: true });
        }
        const storages = await query.orderBy('storage.name', 'ASC').getMany();
        return storages.map((storage) => this.mapStorage(storage));
    }
    async getStorageById(id) {
        const storage = await this.storageRepository.findOne({
            where: { id },
            relations: ['branch'],
        });
        if (!storage) {
            return null;
        }
        return this.mapStorage(storage);
    }
    async createStorage(data) {
        const storage = this.storageRepository.create({
            name: data.name,
            code: data.code ?? undefined,
            category: data.category,
            type: data.type,
            branchId: data.branchId ?? null,
            capacity: data.capacity ?? null,
            location: data.location ?? null,
            isDefault: !!data.isDefault,
            isActive: data.isActive !== false,
        });
        const saved = await this.storageRepository.save(storage);
        const created = await this.getStorageById(saved.id);
        return { success: true, storage: created };
    }
    async updateStorage(id, data) {
        const updateData = { ...data };
        if (updateData.category) {
            updateData.category = updateData.category;
        }
        if (updateData.type) {
            updateData.type = updateData.type;
        }
        await this.storageRepository.update(id, updateData);
        const updated = await this.getStorageById(id);
        if (!updated) {
            return { success: false, message: 'Storage not found', statusCode: 404 };
        }
        return { success: true, storage: updated };
    }
    async deleteStorage(id) {
        const result = await this.storageRepository.softDelete(id);
        if (!result.affected) {
            return { success: false, message: 'Storage not found', statusCode: 404 };
        }
        return { success: true };
    }
    mapStorage(storage) {
        return {
            id: storage.id,
            name: storage.name,
            code: storage.code ?? null,
            category: storage.category,
            type: storage.type,
            branchId: storage.branchId ?? null,
            branch: storage.branch
                ? {
                    id: storage.branch.id,
                    name: storage.branch.name,
                }
                : null,
            location: storage.location ?? null,
            capacity: storage.capacity ?? null,
            isDefault: storage.isDefault,
            isActive: storage.isActive,
            createdAt: storage.createdAt,
            updatedAt: storage.updatedAt,
        };
    }
};
exports.StoragesService = StoragesService;
exports.StoragesService = StoragesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(storage_entity_1.Storage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StoragesService);
//# sourceMappingURL=storages.service.js.map