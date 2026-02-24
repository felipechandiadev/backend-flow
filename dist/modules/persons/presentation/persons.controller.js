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
exports.PersonsController = void 0;
const common_1 = require("@nestjs/common");
const persons_service_1 = require("../application/persons.service");
const person_entity_1 = require("../domain/person.entity");
let PersonsController = class PersonsController {
    constructor(personsService) {
        this.personsService = personsService;
    }
    async findAll(term, limit, type, includeInactive) {
        try {
            const params = {
                term,
                limit: limit ? parseInt(limit, 10) : undefined,
                type,
                includeInactive: includeInactive === 'true',
            };
            const persons = await this.personsService.findAll(params);
            return {
                success: true,
                data: persons,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id, includeInactive) {
        try {
            const person = await this.personsService.findOne(id, includeInactive === 'true');
            return {
                success: true,
                person,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, error instanceof Error && error.message.includes('not found')
                ? common_1.HttpStatus.NOT_FOUND
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(data) {
        try {
            const person = await this.personsService.create(data);
            return {
                success: true,
                person,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, data) {
        try {
            const person = await this.personsService.update(id, data);
            return {
                success: true,
                person,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, error instanceof Error && error.message.includes('not found')
                ? common_1.HttpStatus.NOT_FOUND
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            await this.personsService.remove(id);
            return {
                success: true,
                message: 'Person deleted successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, error instanceof Error && error.message.includes('not found')
                ? common_1.HttpStatus.NOT_FOUND
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addBankAccount(personId, accountData) {
        try {
            const person = await this.personsService.addBankAccount(personId, accountData);
            return {
                success: true,
                person,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, error instanceof Error && error.message.includes('not found')
                ? common_1.HttpStatus.NOT_FOUND
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async removeBankAccount(personId, accountKey) {
        try {
            await this.personsService.removeBankAccount(personId, accountKey);
            return {
                success: true,
                message: 'Bank account removed successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            }, error instanceof Error && error.message.includes('not found')
                ? common_1.HttpStatus.NOT_FOUND
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.PersonsController = PersonsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('term')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], PersonsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PersonsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PersonsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PersonsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PersonsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':personId/bank-accounts'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('personId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PersonsController.prototype, "addBankAccount", null);
__decorate([
    (0, common_1.Delete)(':personId/bank-accounts/:accountKey'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('personId')),
    __param(1, (0, common_1.Param)('accountKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PersonsController.prototype, "removeBankAccount", null);
exports.PersonsController = PersonsController = __decorate([
    (0, common_1.Controller)('persons'),
    __metadata("design:paramtypes", [persons_service_1.PersonsService])
], PersonsController);
//# sourceMappingURL=persons.controller.js.map