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
exports.BankTransfersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../users/domain/user.entity");
const branch_entity_1 = require("../../branches/domain/branch.entity");
const transactions_service_1 = require("../../transactions/application/transactions.service");
const create_transaction_dto_1 = require("../../transactions/application/dto/create-transaction.dto");
let BankTransfersService = class BankTransfersService {
    constructor(userRepository, branchRepository, transactionsService) {
        this.userRepository = userRepository;
        this.branchRepository = branchRepository;
        this.transactionsService = transactionsService;
    }
    async list() {
        return [];
    }
    async create(payload) {
        const bankAccountKey = this.asString(payload.bankAccountKey);
        const amount = Number(payload.amount ?? 0);
        const notes = this.asString(payload.notes);
        const occurredOn = this.asString(payload.occurredOn);
        if (!bankAccountKey || amount <= 0) {
            return { success: false, error: 'Cuenta bancaria y monto son obligatorios.' };
        }
        const user = await this.userRepository.findOne({
            where: { deletedAt: (0, typeorm_2.IsNull)() },
            order: { userName: 'ASC' },
        });
        if (!user) {
            return { success: false, error: 'No hay usuarios disponibles para registrar el movimiento.' };
        }
        try {
            const createTxDto = new create_transaction_dto_1.CreateBankTransferDto();
            createTxDto.bankAccountKey = bankAccountKey;
            createTxDto.amount = amount;
            createTxDto.notes = notes || undefined;
            createTxDto.occurredOn = occurredOn || undefined;
            const branch = await this.branchRepository.findOne({
                where: { deletedAt: (0, typeorm_2.IsNull)() },
                order: { createdAt: 'ASC' },
            });
            if (!branch) {
                return { success: false, error: 'No branch available' };
            }
            const transaction = await this.transactionsService.createTransaction(createTxDto.toCreateTransactionDto(user.id, branch.id));
            return {
                success: true,
                data: {
                    id: transaction.id,
                    documentNumber: transaction.documentNumber,
                    createdAt: transaction.createdAt,
                    asientos: transaction.metadata?.ledgerEntriesGenerated,
                },
            };
        }
        catch (err) {
            return {
                success: false,
                error: `Error al crear transferencia: ${err.message}`,
            };
        }
    }
    asString(value) {
        if (typeof value !== 'string') {
            return null;
        }
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
    }
};
exports.BankTransfersService = BankTransfersService;
exports.BankTransfersService = BankTransfersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        transactions_service_1.TransactionsService])
], BankTransfersService);
//# sourceMappingURL=bank-transfers.service.js.map