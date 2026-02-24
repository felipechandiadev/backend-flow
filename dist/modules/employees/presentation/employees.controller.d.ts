import { EmployeesService } from '../application/employees.service';
import { EmployeeStatus } from '../domain/employee.entity';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    getEmployees(includeTerminated?: string, status?: string, branchId?: string, companyId?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            companyId: string;
            personId: string;
            branchId: string | null;
            resultCenterId: string | null;
            organizationalUnitId: string | null;
            employmentType: import("../domain/employee.entity").EmploymentType;
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
        }[];
    }>;
    getEmployeeById(id: string): Promise<{
        success: boolean;
        data: {
            id: string;
            companyId: string;
            personId: string;
            branchId: string | null;
            resultCenterId: string | null;
            organizationalUnitId: string | null;
            employmentType: import("../domain/employee.entity").EmploymentType;
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
        };
    }>;
    createEmployee(data: {
        personId: string;
        companyId?: string;
        branchId?: string;
        resultCenterId?: string;
        organizationalUnitId?: string;
        employmentType: string;
        hireDate: string;
        baseSalary?: string;
        metadata?: Record<string, unknown>;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            companyId: string;
            personId: string;
            branchId: string | null;
            resultCenterId: string | null;
            organizationalUnitId: string | null;
            employmentType: import("../domain/employee.entity").EmploymentType;
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
        } | null;
    }>;
    updateEmployee(id: string, data: Partial<{
        branchId?: string | null;
        resultCenterId?: string | null;
        organizationalUnitId?: string | null;
        employmentType: string;
        status: EmployeeStatus;
        terminationDate?: string | null;
        baseSalary?: string | null;
        metadata?: Record<string, unknown>;
    }>): Promise<{
        success: boolean;
        data: {
            id: string;
            companyId: string;
            personId: string;
            branchId: string | null;
            resultCenterId: string | null;
            organizationalUnitId: string | null;
            employmentType: import("../domain/employee.entity").EmploymentType;
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
        };
    }>;
    deleteEmployee(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
