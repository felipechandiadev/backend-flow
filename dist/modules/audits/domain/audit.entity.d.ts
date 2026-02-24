import { User } from '@modules/users/domain/user.entity';
import { AuditActionType } from '@modules/audits/domain/audit.types';
export declare class Audit {
    id: string;
    entityName: string;
    entityId: string;
    userId?: string;
    user?: User;
    action: AuditActionType;
    changes?: Record<string, any>;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    description?: string;
    createdAt: Date;
    deletedAt?: Date;
}
