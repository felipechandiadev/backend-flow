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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallmentRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const installment_entity_1 = require("../domain/installment.entity");
let InstallmentRepository = class InstallmentRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(installment_entity_1.Installment, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async getOverdueInstallments(today = new Date()) {
        return this.find({
            where: [
                {
                    status: installment_entity_1.InstallmentStatus.OVERDUE,
                },
                {
                    status: installment_entity_1.InstallmentStatus.PENDING,
                    dueDate: (0, typeorm_1.LessThan)(today),
                },
                {
                    status: installment_entity_1.InstallmentStatus.PARTIAL,
                    dueDate: (0, typeorm_1.LessThan)(today),
                },
            ],
        });
    }
    async getUpcomingInstallments(fromDate, toDate) {
        return this.find({
            where: {
                status: (0, typeorm_1.In)([installment_entity_1.InstallmentStatus.PENDING, installment_entity_1.InstallmentStatus.PARTIAL]),
                dueDate: (0, typeorm_1.Between)(fromDate, toDate),
            },
            order: { dueDate: 'ASC' },
        });
    }
    async getInstallmentsByTransaction(saleTransactionId) {
        return this.find({
            where: { saleTransactionId },
            order: { installmentNumber: 'ASC' },
        });
    }
    async getTransactionCarteraStatus(saleTransactionId) {
        const installments = await this.getInstallmentsByTransaction(saleTransactionId);
        const totalAmount = installments.reduce((sum, i) => sum + parseFloat(i.amount.toString()), 0);
        const totalPaid = installments.reduce((sum, i) => sum + parseFloat(i.amountPaid.toString()), 0);
        const paidInstallments = installments.filter(i => i.status === installment_entity_1.InstallmentStatus.PAID).length;
        const pendingInstallments = installments.filter(i => [installment_entity_1.InstallmentStatus.PENDING, installment_entity_1.InstallmentStatus.PARTIAL].includes(i.status)).length;
        return {
            totalInstallments: installments.length,
            totalAmount,
            totalPaid,
            pendingAmount: totalAmount - totalPaid,
            paidInstallments,
            pendingInstallments,
            status: totalPaid === 0 ? 'NOT_PAID' : totalPaid === totalAmount ? 'PAID' : 'PARTIAL',
            installments,
        };
    }
    async getCarteraByDueDate(fromDate, toDate) {
        return this.find({
            where: {
                dueDate: (0, typeorm_1.Between)(fromDate, toDate),
            },
            order: { dueDate: 'ASC' },
        });
    }
    async getOverdueSummary(today = new Date()) {
        const overdue = await this.getOverdueInstallments(today);
        const summary = {
            totalOverdueInstallments: overdue.length,
            totalOverdueAmount: 0,
            byDaysRange: {
                '0-10': { count: 0, amount: 0 },
                '11-30': { count: 0, amount: 0 },
                '31-60': { count: 0, amount: 0 },
                '60+': { count: 0, amount: 0 },
            },
            details: [],
        };
        for (const inst of overdue) {
            const daysOverdue = inst.getDaysOverdue(today);
            const pending = inst.getPendingAmount();
            summary.totalOverdueAmount += pending;
            summary.details.push({
                id: inst.id,
                installmentNumber: inst.installmentNumber,
                amount: inst.amount,
                amountPaid: inst.amountPaid,
                pendingAmount: pending,
                daysOverdue,
                dueDate: inst.dueDate,
            });
            if (daysOverdue <= 10) {
                summary.byDaysRange['0-10'].count++;
                summary.byDaysRange['0-10'].amount += pending;
            }
            else if (daysOverdue <= 30) {
                summary.byDaysRange['11-30'].count++;
                summary.byDaysRange['11-30'].amount += pending;
            }
            else if (daysOverdue <= 60) {
                summary.byDaysRange['31-60'].count++;
                summary.byDaysRange['31-60'].amount += pending;
            }
            else {
                summary.byDaysRange['60+'].count++;
                summary.byDaysRange['60+'].amount += pending;
            }
        }
        return summary;
    }
};
exports.InstallmentRepository = InstallmentRepository;
exports.InstallmentRepository = InstallmentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], InstallmentRepository);
//# sourceMappingURL=installment.repository.js.map