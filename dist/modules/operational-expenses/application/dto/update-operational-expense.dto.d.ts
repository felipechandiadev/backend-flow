import { CreateOperationalExpenseDto } from './create-operational-expense.dto';
export declare class UpdateOperationalExpenseDto implements Partial<CreateOperationalExpenseDto> {
    companyId?: string;
    branchId?: string;
    resultCenterId?: string;
    categoryId?: string;
    supplierId?: string;
    employeeId?: string;
    referenceNumber?: string;
    description?: string;
    operationDate?: string;
    status?: any;
    metadata?: Record<string, unknown>;
    createdBy?: string;
}
