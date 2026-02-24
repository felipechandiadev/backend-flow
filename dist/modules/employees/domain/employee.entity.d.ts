import "reflect-metadata";
import { Company } from '@modules/companies/domain/company.entity';
import { Person } from '@modules/persons/domain/person.entity';
import { Branch } from '@modules/branches/domain/branch.entity';
import { ResultCenter } from '@modules/result-centers/domain/result-center.entity';
import { OrganizationalUnit } from '@modules/organizational-units/domain/organizational-unit.entity';
export declare enum EmploymentType {
    FULL_TIME = "FULL_TIME",
    PART_TIME = "PART_TIME",
    CONTRACTOR = "CONTRACTOR",
    TEMPORARY = "TEMPORARY",
    INTERN = "INTERN"
}
export declare enum EmployeeStatus {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    TERMINATED = "TERMINATED"
}
export declare class Employee {
    id: string;
    companyId: string;
    personId: string;
    branchId?: string | null;
    resultCenterId?: string | null;
    organizationalUnitId?: string | null;
    employmentType: EmploymentType;
    status: EmployeeStatus;
    hireDate: string;
    terminationDate?: string | null;
    baseSalary?: string | null;
    metadata?: Record<string, unknown> | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    company: Company;
    person: Person;
    branch?: Branch | null;
    resultCenter?: ResultCenter | null;
    organizationalUnit?: OrganizationalUnit | null;
}
