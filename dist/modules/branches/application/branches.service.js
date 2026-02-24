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
exports.BranchesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const branch_entity_1 = require("../domain/branch.entity");
let BranchesService = class BranchesService {
    constructor(branchRepository) {
        this.branchRepository = branchRepository;
    }
    async getBranchById(id) {
        const branch = await this.branchRepository.findOne({ where: { id } });
        if (!branch) {
            return null;
        }
        return {
            id: branch.id,
            companyId: branch.companyId ?? null,
            name: branch.name,
            address: branch.address ?? null,
            phone: branch.phone ?? null,
            location: branch.location ?? null,
            isActive: branch.isActive,
            isHeadquarters: branch.isHeadquarters,
            createdAt: branch.createdAt,
            updatedAt: branch.updatedAt,
        };
    }
    async getAllBranches(includeInactive) {
        const query = this.branchRepository.createQueryBuilder('branch');
        if (!includeInactive) {
            query.where('branch.isActive = :isActive', { isActive: true });
        }
        const branches = await query.orderBy('branch.name', 'ASC').getMany();
        return branches.map(branch => ({
            id: branch.id,
            companyId: branch.companyId ?? null,
            name: branch.name,
            address: branch.address ?? null,
            phone: branch.phone ?? null,
            location: branch.location ?? null,
            isActive: branch.isActive,
            isHeadquarters: branch.isHeadquarters,
            createdAt: branch.createdAt,
            updatedAt: branch.updatedAt,
        }));
    }
    async updateBranch(id, data) {
        const branch = await this.branchRepository.findOne({ where: { id } });
        if (!branch) {
            return null;
        }
        if (data.isHeadquarters === true) {
            await this.branchRepository.update({ isHeadquarters: true }, { isHeadquarters: false });
        }
        await this.branchRepository.update(id, data);
        return this.getBranchById(id);
    }
};
exports.BranchesService = BranchesService;
exports.BranchesService = BranchesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BranchesService);
//# sourceMappingURL=branches.service.js.map