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
exports.StoragesController = void 0;
const common_1 = require("@nestjs/common");
const storages_service_1 = require("../application/storages.service");
let StoragesController = class StoragesController {
    constructor(storagesService) {
        this.storagesService = storagesService;
    }
    async getStorages(includeInactive) {
        const include = includeInactive === 'true' || includeInactive === '1';
        return this.storagesService.getAllStorages(include);
    }
    async getStorageById(id) {
        const storage = await this.storagesService.getStorageById(id);
        if (!storage) {
            return { success: false, message: 'Storage not found', statusCode: 404 };
        }
        return storage;
    }
    async createStorage(data) {
        return this.storagesService.createStorage(data);
    }
    async updateStorage(id, data) {
        return this.storagesService.updateStorage(id, data);
    }
    async deleteStorage(id) {
        return this.storagesService.deleteStorage(id);
    }
};
exports.StoragesController = StoragesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoragesController.prototype, "getStorages", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoragesController.prototype, "getStorageById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoragesController.prototype, "createStorage", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StoragesController.prototype, "updateStorage", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoragesController.prototype, "deleteStorage", null);
exports.StoragesController = StoragesController = __decorate([
    (0, common_1.Controller)('storages'),
    __metadata("design:paramtypes", [storages_service_1.StoragesService])
], StoragesController);
//# sourceMappingURL=storages.controller.js.map