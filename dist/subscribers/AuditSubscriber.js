"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditSubscriber = void 0;
const typeorm_1 = require("typeorm");
const audit_types_1 = require("../modules/audits/domain/audit.types");
const AUDITABLE_ENTITIES = ['Person'];
let AuditSubscriber = class AuditSubscriber {
    isAuditable(entity) {
        const entityName = entity?.constructor?.name;
        return AUDITABLE_ENTITIES.includes(entityName);
    }
    sanitizeEntity(entity) {
        const sanitized = {};
        if (entity && typeof entity === 'object') {
            Object.keys(entity).forEach(key => {
                if (!key.startsWith('_') && !key.includes('Manager') && !key.includes('Repository')) {
                    const value = entity[key];
                    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
                        sanitized[key] = value;
                    }
                }
            });
        }
        return sanitized;
    }
    async afterInsert(event) {
        if (!this.isAuditable(event.entity))
            return;
        try {
            const entityName = event.entity.constructor.name;
            const auditRepo = event.manager.getRepository("Audit");
            await auditRepo.save(auditRepo.create({
                entityName,
                entityId: event.entity.id,
                userId: undefined,
                action: audit_types_1.AuditActionType.CREATE,
                oldValues: undefined,
                newValues: this.sanitizeEntity(event.entity),
                changes: {
                    fields: {},
                    changedFields: [],
                },
            }));
        }
        catch (error) {
            console.error('[AuditSubscriber] Error en afterInsert:', error);
        }
    }
    async afterUpdate(event) {
        if (!event.entity || !this.isAuditable(event.entity))
            return;
        try {
            const entityName = event.entity.constructor.name;
            const oldValues = event.databaseEntity ? this.sanitizeEntity(event.databaseEntity) : undefined;
            const newValues = event.entity ? this.sanitizeEntity(event.entity) : undefined;
            const changes = this.calculateChanges(oldValues, newValues);
            const auditRepo = event.manager.getRepository("Audit");
            await auditRepo.save(auditRepo.create({
                entityName,
                entityId: event.entity.id,
                userId: undefined,
                action: audit_types_1.AuditActionType.UPDATE,
                oldValues,
                newValues,
                changes,
            }));
        }
        catch (error) {
            console.error('[AuditSubscriber] Error en afterUpdate:', error);
        }
    }
    async afterRemove(event) {
        if (!this.isAuditable(event.entity))
            return;
        try {
            const entityName = event.entity.constructor.name;
            const auditRepo = event.manager.getRepository("Audit");
            await auditRepo.save(auditRepo.create({
                entityName,
                entityId: event.entity.id,
                userId: undefined,
                action: audit_types_1.AuditActionType.DELETE,
                oldValues: this.sanitizeEntity(event.entity),
                newValues: undefined,
                changes: { fields: {}, changedFields: [] },
            }));
        }
        catch (error) {
            console.error('[AuditSubscriber] Error en afterRemove:', error);
        }
    }
    calculateChanges(oldValues, newValues) {
        const fields = {};
        const changedFields = [];
        if (!oldValues && newValues) {
            Object.entries(newValues).forEach(([key, value]) => {
                fields[key] = { oldValue: null, newValue: value };
                changedFields.push(key);
            });
        }
        if (oldValues && newValues) {
            const allKeys = new Set([...Object.keys(oldValues), ...Object.keys(newValues)]);
            allKeys.forEach((key) => {
                const oldValue = oldValues[key];
                const newValue = newValues[key];
                if (oldValue !== newValue) {
                    fields[key] = { oldValue, newValue };
                    changedFields.push(key);
                }
            });
        }
        return { fields, changedFields };
    }
};
exports.AuditSubscriber = AuditSubscriber;
exports.AuditSubscriber = AuditSubscriber = __decorate([
    (0, typeorm_1.EventSubscriber)()
], AuditSubscriber);
//# sourceMappingURL=AuditSubscriber.js.map