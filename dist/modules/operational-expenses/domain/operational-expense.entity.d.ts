import "reflect-metadata";
import { Company } from '../../companies/domain/company.entity';
import { Branch } from '../../branches/domain/branch.entity';
import { ResultCenter } from '../../result-centers/domain/result-center.entity';
import { ExpenseCategory } from '../../expense-categories/domain/expense-category.entity';
import { Supplier } from '../../suppliers/domain/supplier.entity';
import { Employee } from '../../employees/domain/employee.entity';
import { User } from '../../users/domain/user.entity';
export declare enum OperationalExpenseStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}
export interface OperationalExpenseMetadata {
    estimatedAmount?: number;
    invoiceNumber?: string;
    notes?: string;
    attachments?: string[];
}
export declare class OperationalExpense {
    id: string;
    companyId: string;
    branchId?: string | null;
    resultCenterId?: string | null;
    categoryId: string;
    supplierId?: string | null;
    employeeId?: string | null;
    referenceNumber: string;
    description?: string;
    operationDate: string;
    status: OperationalExpenseStatus;
    metadata?: OperationalExpenseMetadata | null;
    createdBy: string;
    approvedBy?: string | null;
    approvedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    company: Company;
    branch?: Branch | null;
    resultCenter?: ResultCenter | null;
    category: ExpenseCategory;
    supplier?: Supplier | null;
    employee?: Employee | null;
    createdByUser: User;
    approvedByUser?: User | null;
}
