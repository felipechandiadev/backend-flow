import { InsertEvent, UpdateEvent, RemoveEvent } from 'typeorm';
export declare class AuditSubscriber {
    private isAuditable;
    private sanitizeEntity;
    afterInsert(event: InsertEvent<any>): Promise<void>;
    afterUpdate(event: UpdateEvent<any>): Promise<void>;
    afterRemove(event: RemoveEvent<any>): Promise<void>;
    private calculateChanges;
}
