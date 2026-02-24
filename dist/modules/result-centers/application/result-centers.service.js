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
exports.ResultCentersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const result_center_entity_1 = require("../domain/result-center.entity");
let ResultCentersService = class ResultCentersService {
    constructor(resultCenterRepository) {
        this.resultCenterRepository = resultCenterRepository;
    }
    async getResultCenterById(id) {
        const resultCenter = await this.resultCenterRepository.findOne({
            where: { id },
            relations: ['company', 'branch', 'parent'],
        });
        if (!resultCenter) {
            return null;
        }
        return this.formatResultCenter(resultCenter);
    }
    async getAllResultCenters(params) {
        const query = this.resultCenterRepository.createQueryBuilder('rc');
        query.leftJoinAndSelect('rc.company', 'company');
        query.leftJoinAndSelect('rc.branch', 'branch');
        query.leftJoinAndSelect('rc.parent', 'parent');
        if (!params?.includeInactive) {
            query.andWhere('rc.isActive = :isActive', { isActive: true });
        }
        if (params?.type) {
            query.andWhere('rc.type = :type', { type: params.type });
        }
        if (params?.branchId) {
            query.andWhere('rc.branchId = :branchId', { branchId: params.branchId });
        }
        if (params?.companyId) {
            query.andWhere('rc.companyId = :companyId', { companyId: params.companyId });
        }
        const resultCenters = await query.orderBy('rc.code', 'ASC').getMany();
        return resultCenters.map((rc) => this.formatResultCenter(rc));
    }
    async createResultCenter(data) {
        const createData = {
            ...data,
            description: data.description ?? undefined,
            type: data.type ?? result_center_entity_1.ResultCenterType.OTHER,
        };
        const resultCenter = this.resultCenterRepository.create(createData);
        await this.resultCenterRepository.save(resultCenter);
        return this.getResultCenterById(resultCenter.id);
    }
    async updateResultCenter(id, data) {
        const updateData = { ...data };
        if (updateData.type) {
            updateData.type = updateData.type;
        }
        await this.resultCenterRepository.update(id, updateData);
        return this.getResultCenterById(id);
    }
    async deleteResultCenter(id) {
        await this.resultCenterRepository.delete(id);
        return { success: true };
    }
    formatResultCenter(resultCenter) {
        return {
            id: resultCenter.id,
            companyId: resultCenter.companyId,
            parentId: resultCenter.parentId ?? null,
            branchId: resultCenter.branchId ?? null,
            code: resultCenter.code,
            name: resultCenter.name,
            description: resultCenter.description ?? null,
            type: resultCenter.type,
            isActive: resultCenter.isActive,
            createdAt: resultCenter.createdAt,
            updatedAt: resultCenter.updatedAt,
            company: resultCenter.company
                ? { id: resultCenter.company.id, name: resultCenter.company.name }
                : null,
            branch: resultCenter.branch
                ? { id: resultCenter.branch.id, name: resultCenter.branch.name }
                : null,
            parent: resultCenter.parent
                ? { id: resultCenter.parent.id, name: resultCenter.parent.name, code: resultCenter.parent.code }
                : null,
        };
    }
};
exports.ResultCentersService = ResultCentersService;
exports.ResultCentersService = ResultCentersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(result_center_entity_1.ResultCenter)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ResultCentersService);
//# sourceMappingURL=result-centers.service.js.map