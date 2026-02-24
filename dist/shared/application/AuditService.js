"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const audit_entity_1 = require("../../modules/audits/domain/audit.entity");
const audit_types_1 = require("../../modules/audits/domain/audit.types");
const uuid_1 = require("uuid");
class AuditService {
    constructor(dataSource) {
        this.dataSource = dataSource;
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
                if (this.shouldAuditField(key, oldValue, newValue)) {
                    if (oldValue !== newValue) {
                        fields[key] = { oldValue, newValue };
                        changedFields.push(key);
                    }
                }
            });
        }
        if (oldValues && !newValues) {
            Object.entries(oldValues).forEach(([key, value]) => {
                if (this.shouldAuditField(key, value, undefined)) {
                    fields[key] = { oldValue: value, newValue: null };
                }
            });
        }
        return {
            fields,
            changedFields: changedFields,
        };
    }
    shouldAuditField(fieldName, oldValue, newValue) {
        const ignoredFields = ['id', '__v', 'createdAt', 'updatedAt', 'deletedAt', 'person'];
        if (ignoredFields.includes(fieldName)) {
            return false;
        }
        if (typeof oldValue === 'object' && oldValue !== null && !(oldValue instanceof Date)) {
            return false;
        }
        if (typeof newValue === 'object' && newValue !== null && !(newValue instanceof Date)) {
            return false;
        }
        return true;
    }
    generateDescription(action, entityName, changes) {
        const fieldsStr = changes.changedFields.length > 0 ? changes.changedFields.join(', ') : 'sin cambios';
        switch (action) {
            case audit_types_1.AuditActionType.CREATE:
                return `${entityName} creado`;
            case audit_types_1.AuditActionType.UPDATE:
                return `${entityName} actualizado: ${fieldsStr}`;
            case audit_types_1.AuditActionType.DELETE:
                return `${entityName} eliminado`;
            default:
                return `${entityName} modificado`;
        }
    }
    async logAudit(payload) {
        const { entityName, entityId, userId, action, oldValues, newValues } = payload;
        const changes = this.calculateChanges(oldValues, newValues);
        const description = this.generateDescription(action, entityName, changes);
        const audit = new audit_entity_1.Audit();
        audit.id = (0, uuid_1.v4)();
        audit.entityName = entityName;
        audit.entityId = entityId;
        audit.userId = userId;
        audit.action = action;
        audit.changes = changes;
        audit.oldValues = oldValues;
        audit.newValues = newValues;
        audit.description = description;
        const auditRepo = this.dataSource.getRepository("Audit");
        return await auditRepo.save(audit);
    }
    async getAuditsByEntity(entityName, entityId) {
        const auditRepo = this.dataSource.getRepository("Audit");
        return await auditRepo.find({
            where: { entityName, entityId },
            order: { createdAt: 'DESC' },
        });
    }
    async getAuditsByUser(userId) {
        const auditRepo = this.dataSource.getRepository("Audit");
        return await auditRepo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async getAllAudits(limit = 100, offset = 0) {
        const auditRepo = this.dataSource.getRepository("Audit");
        return await auditRepo.find({
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });
    }
}
exports.AuditService = AuditService;
//# sourceMappingURL=AuditService.js.map