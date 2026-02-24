import { OperationalExpenseStatus } from '../../domain/operational-expense.entity';
export declare class CreateOperationalExpenseDto {
    companyId: string;
    branchId?: string;
    resultCenterId?: string;
    categoryId: string;
    supplierId?: string;
    employeeId?: string;
    referenceNumber: string;
    description?: string;
    operationDate: string;
    status?: OperationalExpenseStatus;
    metadata?: Record<string, unknown>;
    createdBy: string;
}
