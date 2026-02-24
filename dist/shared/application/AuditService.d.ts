import { DataSource } from 'typeorm';
import { Audit } from '../../modules/audits/domain/audit.entity';
import { AuditActionType } from '../../modules/audits/domain/audit.types';
export interface AuditLogPayload {
    entityName: string;
    entityId: string;
    userId?: string;
    action: AuditActionType;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
}
export declare class AuditService {
    private dataSource;
    constructor(dataSource: DataSource);
    private calculateChanges;
    private shouldAuditField;
    private generateDescription;
    logAudit(payload: AuditLogPayload): Promise<Audit>;
    getAuditsByEntity(entityName: string, entityId: string): Promise<Audit[]>;
    getAuditsByUser(userId: string): Promise<Audit[]>;
    getAllAudits(limit?: number, offset?: number): Promise<Audit[]>;
}
