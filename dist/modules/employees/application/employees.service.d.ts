import { Repository } from 'typeorm';
import { Employee, EmployeeStatus, EmploymentType } from '../domain/employee.entity';
import { Company } from '@modules/companies/domain/company.entity';
export declare class EmployeesService {
    private readonly employeeRepository;
    private readonly companyRepository;
    constructor(employeeRepository: Repository<Employee>, companyRepository: Repository<Company>);
    getEmployeeById(id: string): Promise<{
        id: string;
        companyId: string;
        personId: string;
        branchId: string | null;
        resultCenterId: string | null;
        organizationalUnitId: string | null;
        employmentType: EmploymentType;
        status: EmployeeStatus;
        hireDate: string;
        terminationDate: string | null;
        baseSalary: string | null;
        metadata: Record<string, unknown> | null;
        createdAt: Date;
        updatedAt: Date;
        company: {
            id: string;
            name: string;
        } | null;
        person: {
            id: string;
            firstName: string;
            lastName: string | undefined;
            businessName: string | undefined;
            email: string | undefined;
            phone: string | undefined;
        } | null;
        branch: {
            id: string;
            name: string;
        } | null;
        resultCenter: {
            id: string;
            name: string;
        } | null;
        organizationalUnit: {
            id: string;
            name: string;
        } | null;
    } | null>;
    getAllEmployees(params?: {
        includeTerminated?: boolean;
        status?: EmployeeStatus;
        branchId?: string;
        companyId?: string;
    }): Promise<{
        id: string;
        companyId: string;
        personId: string;
        branchId: string | null;
        resultCenterId: string | null;
        organizationalUnitId: string | null;
        employmentType: EmploymentType;
        status: EmployeeStatus;
        hireDate: string;
        terminationDate: string | null;
        baseSalary: string | null;
        metadata: Record<string, unknown> | null;
        createdAt: Date;
        updatedAt: Date;
        company: {
            id: string;
            name: string;
        } | null;
        person: {
            id: string;
            firstName: string;
            lastName: string | undefined;
            businessName: string | undefined;
            email: string | undefined;
            phone: string | undefined;
        } | null;
        branch: {
            id: string;
            name: string;
        } | null;
        resultCenter: {
            id: string;
            name: string;
        } | null;
        organizationalUnit: {
            id: string;
            name: string;
        } | null;
    }[]>;
    createEmployee(data: {
        personId: string;
        companyId?: string;
        branchId?: string;
        resultCenterId?: string;
        organizationalUnitId?: string;
        employmentType: EmploymentType | string;
        hireDate: string;
        baseSalary?: string;
        metadata?: Record<string, unknown>;
    }): Promise<{
        id: string;
        companyId: string;
        personId: string;
        branchId: string | null;
        resultCenterId: string | null;
        organizationalUnitId: string | null;
        employmentType: EmploymentType;
        status: EmployeeStatus;
        hireDate: string;
        terminationDate: string | null;
        baseSalary: string | null;
        metadata: Record<string, unknown> | null;
        createdAt: Date;
        updatedAt: Date;
        company: {
            id: string;
            name: string;
        } | null;
        person: {
            id: string;
            firstName: string;
            lastName: string | undefined;
            businessName: string | undefined;
            email: string | undefined;
            phone: string | undefined;
        } | null;
        branch: {
            id: string;
            name: string;
        } | null;
        resultCenter: {
            id: string;
            name: string;
        } | null;
        organizationalUnit: {
            id: string;
            name: string;
        } | null;
    } | null>;
    updateEmployee(id: string, data: Partial<{
        branchId?: string | null;
        resultCenterId?: string | null;
        organizationalUnitId?: string | null;
        employmentType: EmploymentType | string;
        status: EmployeeStatus;
        terminationDate?: string | null;
        baseSalary?: string | null;
        metadata?: Record<string, unknown>;
    }>): Promise<{
        id: string;
        companyId: string;
        personId: string;
        branchId: string | null;
        resultCenterId: string | null;
        organizationalUnitId: string | null;
        employmentType: EmploymentType;
        status: EmployeeStatus;
        hireDate: string;
        terminationDate: string | null;
        baseSalary: string | null;
        metadata: Record<string, unknown> | null;
        createdAt: Date;
        updatedAt: Date;
        company: {
            id: string;
            name: string;
        } | null;
        person: {
            id: string;
            firstName: string;
            lastName: string | undefined;
            businessName: string | undefined;
            email: string | undefined;
            phone: string | undefined;
        } | null;
        branch: {
            id: string;
            name: string;
        } | null;
        resultCenter: {
            id: string;
            name: string;
        } | null;
        organizationalUnit: {
            id: string;
            name: string;
        } | null;
    } | null>;
    deleteEmployee(id: string): Promise<{
        success: boolean;
    }>;
    private formatEmployee;
}
