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
exports.OperationalExpensesController = void 0;
const common_1 = require("@nestjs/common");
const operational_expenses_service_1 = require("../application/operational-expenses.service");
const create_operational_expense_dto_1 = require("../application/dto/create-operational-expense.dto");
const update_operational_expense_dto_1 = require("../application/dto/update-operational-expense.dto");
let OperationalExpensesController = class OperationalExpensesController {
    constructor(service) {
        this.service = service;
    }
    async findAll(query) {
        return this.service.findAll({
            limit: query.limit ? parseInt(query.limit) : 50,
            offset: query.offset ? parseInt(query.offset) : 0,
            companyId: query.companyId,
            branchId: query.branchId,
            status: query.status,
        });
    }
    async findOne(id) {
        return this.service.findOne(id);
    }
    async create(dto) {
        return this.service.create(dto);
    }
    async update(id, dto) {
        return this.service.update(id, dto);
    }
    async remove(id) {
        await this.service.remove(id);
        return { success: true };
    }
};
exports.OperationalExpensesController = OperationalExpensesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OperationalExpensesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OperationalExpensesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_operational_expense_dto_1.CreateOperationalExpenseDto]),
    __metadata("design:returntype", Promise)
], OperationalExpensesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_operational_expense_dto_1.UpdateOperationalExpenseDto]),
    __metadata("design:returntype", Promise)
], OperationalExpensesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OperationalExpensesController.prototype, "remove", null);
exports.OperationalExpensesController = OperationalExpensesController = __decorate([
    (0, common_1.Controller)('operating-expenses'),
    __metadata("design:paramtypes", [operational_expenses_service_1.OperationalExpensesService])
], OperationalExpensesController);
//# sourceMappingURL=operational-expenses.controller.js.map