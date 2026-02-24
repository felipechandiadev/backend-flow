import { InstallmentService } from '@modules/installments/application/services/installment.service';
import { InstallmentStatus } from '@modules/installments/domain/installment.entity';
export declare class AccountsReceivableController {
    private readonly installmentService;
    constructor(installmentService: InstallmentService);
    getAccountsReceivable(filtersRaw?: string, page?: string, pageSize?: string): Promise<{
        rows: {
            id: string;
            documentNumber: any;
            customerName: any;
            quotaNumber: number;
            totalQuotas: number;
            dueDate: Date;
            quotaAmount: number;
            status: InstallmentStatus;
            createdAt: any;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
}
