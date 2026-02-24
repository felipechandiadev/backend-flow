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
var AccountingEngineListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingEngineListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const typeorm_1 = require("typeorm");
const transaction_created_event_1 = require("../events/transaction-created.event");
const ledger_entries_service_1 = require("../../modules/ledger-entries/application/ledger-entries.service");
let AccountingEngineListener = AccountingEngineListener_1 = class AccountingEngineListener {
    constructor(ledgerService, dataSource) {
        this.ledgerService = ledgerService;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(AccountingEngineListener_1.name);
    }
    async handleTransactionCreated(event) {
        try {
            this.logger.log(`[ACCOUNTING ENGINE] Transaction created event detected. ` +
                `TransactionId: ${event.transaction.id}, ` +
                `Type: ${event.transaction.transactionType}`);
            await this.dataSource.transaction(async (manager) => {
                const ledgerResponse = await this.ledgerService.generateEntriesForTransaction(event.transaction, event.companyId, manager);
                if (ledgerResponse.status === 'REJECTED') {
                    this.logger.error(`[ACCOUNTING ENGINE] FAILED to generate entries for transaction ${event.transaction.id}. ` +
                        `Error: ${ledgerResponse.errors[0]?.message || 'Unknown error'}`);
                    throw new Error(`Accounting engine rejected transaction ${event.transaction.id}: ${ledgerResponse.errors[0]?.message}`);
                }
                this.logger.log(`[ACCOUNTING ENGINE] Successfully generated ${ledgerResponse.entriesGenerated} entries ` +
                    `for transaction ${event.transaction.id}`);
            });
        }
        catch (error) {
            this.logger.error(`[ACCOUNTING ENGINE] ERROR processing transaction ${event.transaction.id}: ` +
                `${error.message}`);
            throw error;
        }
    }
};
exports.AccountingEngineListener = AccountingEngineListener;
__decorate([
    (0, event_emitter_1.OnEvent)('transaction.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transaction_created_event_1.TransactionCreatedEvent]),
    __metadata("design:returntype", Promise)
], AccountingEngineListener.prototype, "handleTransactionCreated", null);
exports.AccountingEngineListener = AccountingEngineListener = AccountingEngineListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ledger_entries_service_1.LedgerEntriesService,
        typeorm_1.DataSource])
], AccountingEngineListener);
//# sourceMappingURL=accounting-engine.listener.js.map