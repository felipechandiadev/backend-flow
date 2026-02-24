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
exports.OrganizationalUnitsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organizational_unit_entity_1 = require("../domain/organizational-unit.entity");
const company_entity_1 = require("../../companies/domain/company.entity");
let OrganizationalUnitsService = class OrganizationalUnitsService {
    constructor(organizationalUnitRepository, companyRepository) {
        this.organizationalUnitRepository = organizationalUnitRepository;
        this.companyRepository = companyRepository;
    }
    async getOrganizationalUnitById(id) {
        const unit = await this.organizationalUnitRepository.findOne({
            where: { id },
            relations: ['company', 'branch', 'resultCenter', 'parent'],
        });
        if (!unit) {
            return null;
        }
        return this.formatOrganizationalUnit(unit);
    }
    async getAllOrganizationalUnits(params) {
        const query = this.organizationalUnitRepository.createQueryBuilder('ou');
        query.leftJoinAndSelect('ou.company', 'company');
        query.leftJoinAndSelect('ou.branch', 'branch');
        query.leftJoinAndSelect('ou.resultCenter', 'resultCenter');
        query.leftJoinAndSelect('ou.parent', 'parent');
        if (!params?.includeInactive) {
            query.andWhere('ou.isActive = :isActive', { isActive: true });
        }
        if (params?.unitType) {
            query.andWhere('ou.unitType = :unitType', { unitType: params.unitType });
        }
        if (params?.branchId) {
            query.andWhere('ou.branchId = :branchId', { branchId: params.branchId });
        }
        if (params?.companyId) {
            query.andWhere('ou.companyId = :companyId', { companyId: params.companyId });
        }
        if (params?.resultCenterId) {
            query.andWhere('ou.resultCenterId = :resultCenterId', {
                resultCenterId: params.resultCenterId,
            });
        }
        const units = await query.orderBy('ou.code', 'ASC').getMany();
        return units.map((item) => this.formatOrganizationalUnit(item));
    }
    async createOrganizationalUnit(data) {
        let companyId = data.companyId;
        if (!companyId) {
            const firstCompany = await this.companyRepository.findOne({
                where: {},
                order: { createdAt: 'ASC' },
            });
            if (!firstCompany) {
                throw new Error('No company found. Please create a company first.');
            }
            companyId = firstCompany.id;
        }
        let code = data.code;
        if (!code) {
            const prefix = data.name
                .substring(0, 3)
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '') || 'OU';
            const timestamp = Date.now().toString().slice(-6);
            code = `${prefix}-${timestamp}`;
        }
        const createData = {
            ...data,
            companyId,
            code,
            description: data.description ?? undefined,
            metadata: data.metadata ?? undefined,
            unitType: data.unitType ?? organizational_unit_entity_1.OrganizationalUnitType.OTHER,
        };
        const unit = this.organizationalUnitRepository.create(createData);
        await this.organizationalUnitRepository.save(unit);
        return this.getOrganizationalUnitById(unit.id);
    }
    async updateOrganizationalUnit(id, data) {
        const updateData = { ...data };
        if (updateData.unitType) {
            updateData.unitType = updateData.unitType;
        }
        if ('description' in updateData) {
            updateData.description = updateData.description ?? undefined;
        }
        if ('metadata' in updateData) {
            updateData.metadata = updateData.metadata ?? undefined;
        }
        await this.organizationalUnitRepository.update(id, updateData);
        return this.getOrganizationalUnitById(id);
    }
    async deleteOrganizationalUnit(id) {
        await this.organizationalUnitRepository.softDelete(id);
        return { success: true };
    }
    formatOrganizationalUnit(unit) {
        return {
            id: unit.id,
            companyId: unit.companyId,
            code: unit.code,
            name: unit.name,
            description: unit.description ?? null,
            unitType: unit.unitType,
            parentId: unit.parentId ?? null,
            branchId: unit.branchId ?? null,
            resultCenterId: unit.resultCenterId ?? null,
            isActive: unit.isActive,
            metadata: unit.metadata ?? null,
            createdAt: unit.createdAt,
            updatedAt: unit.updatedAt,
            company: unit.company ? { id: unit.company.id, name: unit.company.name } : null,
            branch: unit.branch ? { id: unit.branch.id, name: unit.branch.name } : null,
            resultCenter: unit.resultCenter
                ? { id: unit.resultCenter.id, name: unit.resultCenter.name, code: unit.resultCenter.code }
                : null,
            parent: unit.parent
                ? { id: unit.parent.id, name: unit.parent.name, code: unit.parent.code }
                : null,
        };
    }
};
exports.OrganizationalUnitsService = OrganizationalUnitsService;
exports.OrganizationalUnitsService = OrganizationalUnitsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(organizational_unit_entity_1.OrganizationalUnit)),
    __param(1, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OrganizationalUnitsService);
//# sourceMappingURL=organizational-units.service.js.map