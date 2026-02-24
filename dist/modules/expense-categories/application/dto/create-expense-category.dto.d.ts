export declare class CreateExpenseCategoryDto {
    companyId: string;
    code: string;
    name: string;
    groupName?: string;
    description?: string;
    requiresApproval?: boolean;
    approvalThreshold?: number;
    defaultResultCenterId?: string;
    isActive?: boolean;
    examples?: string[];
    metadata?: Record<string, unknown>;
}
