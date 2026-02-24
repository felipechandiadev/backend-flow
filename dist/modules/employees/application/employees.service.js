"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("../domain/employee.entity");
const company_entity_1 = require("../../companies/domain/company.entity");
let EmployeesService = class EmployeesService {
    constructor(employeeRepository, companyRepository) {
        this.employeeRepository = employeeRepository;
        this.companyRepository = companyRepository;
    }
    async getEmployeeById(id) {
        const employee = await this.employeeRepository.findOne({
            where: { id },
            relations: [
                'company',
                'person',
                'branch',
                'resultCenter',
                'organizationalUnit',
            ],
        });
        if (!employee) {
            return null;
        }
        return this.formatEmployee(employee);
    }
    async getAllEmployees(params) {
        const query = this.employeeRepository.createQueryBuilder('employee');
        query.leftJoinAndSelect('employee.company', 'company');
        query.leftJoinAndSelect('employee.person', 'person');
        query.leftJoinAndSelect('employee.branch', 'branch');
        query.leftJoinAndSelect('employee.resultCenter', 'resultCenter');
        query.leftJoinAndSelect('employee.organizationalUnit', 'organizationalUnit');
        if (params?.status) {
            query.andWhere('employee.status = :status', { status: params.status });
        }
        else if (!params?.includeTerminated) {
            query.andWhere('employee.status != :terminated', {
                terminated: employee_entity_1.EmployeeStatus.TERMINATED,
            });
        }
        if (params?.branchId) {
            query.andWhere('employee.branchId = :branchId', {
                branchId: params.branchId,
            });
        }
        if (params?.companyId) {
            query.andWhere('employee.companyId = :companyId', {
                companyId: params.companyId,
            });
        }
        const employees = await query
            .orderBy('person.firstName', 'ASC')
            .addOrderBy('person.lastName', 'ASC')
            .getMany();
        return employees.map((emp) => this.formatEmployee(emp));
    }
    async createEmployee(data) {
        let companyId = data.companyId;
        if (!companyId) {
            const firstCompany = await this.companyRepository.findOne({
                where: {},
                order: { createdAt: 'ASC' },
            });
            if (!firstCompany) {
                throw new Error('No company found. Please create a company first.');
            }
            companyId = firstCompany.id;
        }
        const employeeData = {
            ...data,
            companyId,
            employmentType: data.employmentType,
        };
        const employee = this.employeeRepository.create(employeeData);
        await this.employeeRepository.save(employee);
        return this.getEmployeeById(employee.id);
    }
    async updateEmployee(id, data) {
        const updateData = { ...data };
        if (updateData.employmentType) {
            updateData.employmentType = updateData.employmentType;
        }
        await this.employeeRepository.update(id, updateData);
        return this.getEmployeeById(id);
    }
    async deleteEmployee(id) {
        await this.employeeRepository.softDelete(id);
        return { success: true };
    }
    formatEmployee(employee) {
        return {
            id: employee.id,
            companyId: employee.companyId,
            personId: employee.personId,
            branchId: employee.branchId ?? null,
            resultCenterId: employee.resultCenterId ?? null,
            organizationalUnitId: employee.organizationalUnitId ?? null,
            employmentType: employee.employmentType,
            status: employee.status,
            hireDate: employee.hireDate,
            terminationDate: employee.terminationDate ?? null,
            baseSalary: employee.baseSalary ?? null,
            metadata: employee.metadata ?? null,
            createdAt: employee.createdAt,
            updatedAt: employee.updatedAt,
            company: employee.company ? {
                id: employee.company.id,
                name: employee.company.name,
            } : null,
            person: employee.person ? {
                id: employee.person.id,
                firstName: employee.person.firstName,
                lastName: employee.person.lastName,
                businessName: employee.person.businessName,
                email: employee.person.email,
                phone: employee.person.phone,
            } : null,
            branch: employee.branch ? {
                id: employee.branch.id,
                name: employee.branch.name,
            } : null,
            resultCenter: employee.resultCenter ? {
                id: employee.resultCenter.id,
                name: employee.resultCenter.name,
            } : null,
            organizationalUnit: employee.organizationalUnit ? {
                id: employee.organizationalUnit.id,
                name: employee.organizationalUnit.name,
            } : null,
        };
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(1, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map