import { PaymentsService } from '../application/payments.service';
import { CreateMultiplePaymentsDto } from '../application/dto/create-multiple-payments.dto';
import { PayQuotaDto } from '../application/dto/pay-quota.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createMultiplePayments(dto: CreateMultiplePaymentsDto): Promise<{
        success: boolean;
        payments: any[];
        totalPaid: number;
        change: number;
    }>;
    payQuota(dto: PayQuotaDto): Promise<{
        success: boolean;
        message: string;
        transaction: import("../../transactions/domain/transaction.entity").Transaction;
    }>;
}
