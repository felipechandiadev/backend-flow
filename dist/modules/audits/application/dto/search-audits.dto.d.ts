export declare enum AuditActionType {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}
export declare class SearchAuditsDto {
    entityName?: string;
    entityId?: string;
    userId?: string;
    action?: AuditActionType;
    dateFrom?: string;
    dateTo?: string;
    page?: string;
    limit?: string;
}
