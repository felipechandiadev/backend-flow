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
exports.EmployeesController = void 0;
const common_1 = require("@nestjs/common");
const employees_service_1 = require("../application/employees.service");
let EmployeesController = class EmployeesController {
    constructor(employeesService) {
        this.employeesService = employeesService;
    }
    async getEmployees(includeTerminated, status, branchId, companyId) {
        try {
            const include = includeTerminated === 'true' || includeTerminated === '1';
            const statusFilter = status || undefined;
            const employees = await this.employeesService.getAllEmployees({
                includeTerminated: include,
                status: statusFilter,
                branchId,
                companyId,
            });
            return {
                success: true,
                data: employees,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEmployeeById(id) {
        try {
            const employee = await this.employeesService.getEmployeeById(id);
            if (!employee) {
                throw new common_1.HttpException({
                    success: false,
                    message: 'Employee not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                data: employee,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createEmployee(data) {
        try {
            const employee = await this.employeesService.createEmployee(data);
            return {
                success: true,
                data: employee,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateEmployee(id, data) {
        try {
            const updated = await this.employeesService.updateEmployee(id, data);
            if (!updated) {
                throw new common_1.HttpException({
                    success: false,
                    message: 'Employee not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                data: updated,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteEmployee(id) {
        try {
            await this.employeesService.deleteEmployee(id);
            return {
                success: true,
                message: 'Employee deleted successfully',
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.EmployeesController = EmployeesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('includeTerminated')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('branchId')),
    __param(3, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "getEmployees", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "getEmployeeById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "createEmployee", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "updateEmployee", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeesController.prototype, "deleteEmployee", null);
exports.EmployeesController = EmployeesController = __decorate([
    (0, common_1.Controller)('employees'),
    __metadata("design:paramtypes", [employees_service_1.EmployeesService])
], EmployeesController);
//# sourceMappingURL=employees.controller.js.map