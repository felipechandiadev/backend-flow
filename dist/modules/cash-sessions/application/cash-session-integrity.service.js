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
exports.CashSessionIntegrityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cash_session_entity_1 = require("../domain/cash-session.entity");
let CashSessionIntegrityService = class CashSessionIntegrityService {
    constructor(cashSessionRepository) {
        this.cashSessionRepository = cashSessionRepository;
    }
    async validateIntegrity() {
        const anomalies = [];
        const sessions = await this.cashSessionRepository.find();
        const invalidIds = sessions.filter(session => {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
            return !uuidRegex.test(session.id);
        });
        if (invalidIds.length > 0) {
            anomalies.push(`Encontrados ${invalidIds.length} IDs no válidos: ${invalidIds.map(s => s.id).join(', ')}`);
        }
        const openSessionsByPos = sessions
            .filter(s => s.status === 'OPEN' && s.pointOfSaleId)
            .reduce((acc, session) => {
            const posId = session.pointOfSaleId;
            if (!acc[posId]) {
                acc[posId] = [];
            }
            acc[posId].push(session);
            return acc;
        }, {});
        Object.entries(openSessionsByPos).forEach(([posId, sessions]) => {
            if (sessions.length > 1) {
                anomalies.push(`POS ${posId} tiene ${sessions.length} sesiones abiertas`);
            }
        });
        return { valid: anomalies.length === 0, anomalies, totalSessions: sessions.length };
    }
    async cleanupCorruptSessions() {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
        const corruptSessions = await this.cashSessionRepository
            .createQueryBuilder('cs')
            .where('cs.id NOT REGEXP :regex', { regex: uuidRegex.source })
            .getMany();
        if (corruptSessions.length > 0) {
            await this.cashSessionRepository.remove(corruptSessions);
        }
        return { deletedCount: corruptSessions.length };
    }
};
exports.CashSessionIntegrityService = CashSessionIntegrityService;
exports.CashSessionIntegrityService = CashSessionIntegrityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cash_session_entity_1.CashSession)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CashSessionIntegrityService);
//# sourceMappingURL=cash-session-integrity.service.js.map