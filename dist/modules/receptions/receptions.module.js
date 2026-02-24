"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceptionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const receptions_controller_1 = require("./presentation/receptions.controller");
const receptions_service_1 = require("./application/receptions.service");
const reception_entity_1 = require("./domain/reception.entity");
const reception_line_entity_1 = require("./domain/reception-line.entity");
const storage_entity_1 = require("../storages/domain/storage.entity");
const branch_entity_1 = require("../branches/domain/branch.entity");
const company_entity_1 = require("../companies/domain/company.entity");
const user_entity_1 = require("../users/domain/user.entity");
const transactions_module_1 = require("../transactions/transactions.module");
const product_variants_module_1 = require("../product-variants/product-variants.module");
let ReceptionsModule = class ReceptionsModule {
};
exports.ReceptionsModule = ReceptionsModule;
exports.ReceptionsModule = ReceptionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([reception_entity_1.Reception, reception_line_entity_1.ReceptionLine, storage_entity_1.Storage, branch_entity_1.Branch, company_entity_1.Company, user_entity_1.User]),
            transactions_module_1.TransactionsModule,
            product_variants_module_1.ProductVariantsModule,
        ],
        controllers: [receptions_controller_1.ReceptionsController],
        providers: [receptions_service_1.ReceptionsService],
        exports: [receptions_service_1.ReceptionsService],
    })
], ReceptionsModule);
//# sourceMappingURL=receptions.module.js.map