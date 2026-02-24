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
exports.AuditsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_entity_1 = require("../domain/audit.entity");
let AuditsService = class AuditsService {
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }
    async search(dto) {
        const page = Math.max(Number(dto.page ?? 1), 1);
        const limit = Math.min(Math.max(Number(dto.limit ?? 25), 1), 200);
        const qb = this.auditRepository
            .createQueryBuilder('audit')
            .leftJoinAndSelect('audit.user', 'user')
            .leftJoinAndSelect('user.person', 'person');
        if (dto.entityName) {
            qb.andWhere('audit.entityName = :entityName', { entityName: dto.entityName });
        }
        if (dto.entityId) {
            qb.andWhere('audit.entityId = :entityId', { entityId: dto.entityId });
        }
        if (dto.userId) {
            qb.andWhere('audit.userId = :userId', { userId: dto.userId });
        }
        if (dto.action) {
            qb.andWhere('audit.action = :action', { action: dto.action });
        }
        if (dto.dateFrom) {
            const parsed = new Date(dto.dateFrom);
            if (!Number.isNaN(parsed.getTime())) {
                qb.andWhere('audit.timestamp >= :dateFrom', { dateFrom: parsed });
            }
        }
        if (dto.dateTo) {
            const parsed = new Date(dto.dateTo);
            if (!Number.isNaN(parsed.getTime())) {
                qb.andWhere('audit.timestamp <= :dateTo', { dateTo: parsed });
            }
        }
        qb.orderBy('audit.timestamp', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return {
            success: true,
            data,
            total,
            page,
            limit
        };
    }
    async findOne(id) {
        const audit = await this.auditRepository.findOne({
            where: { id },
            relations: ['user', 'user.person'],
        });
        return {
            success: true,
            data: audit,
        };
    }
};
exports.AuditsService = AuditsService;
exports.AuditsService = AuditsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(audit_entity_1.Audit)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuditsService);
//# sourceMappingURL=audits.service.js.map