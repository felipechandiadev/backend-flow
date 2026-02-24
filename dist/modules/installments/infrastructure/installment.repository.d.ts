import { DataSource, Repository } from 'typeorm';
import { Installment } from '@modules/installments/domain/installment.entity';
export declare class InstallmentRepository extends Repository<Installment> {
    private dataSource;
    constructor(dataSource: DataSource);
    getOverdueInstallments(today?: Date): Promise<Installment[]>;
    getUpcomingInstallments(fromDate: Date, toDate: Date): Promise<Installment[]>;
    getInstallmentsByTransaction(saleTransactionId: string): Promise<Installment[]>;
    getTransactionCarteraStatus(saleTransactionId: string): Promise<{
        totalInstallments: number;
        totalAmount: number;
        totalPaid: number;
        pendingAmount: number;
        paidInstallments: number;
        pendingInstallments: number;
        status: string;
        installments: Installment[];
    }>;
    getCarteraByDueDate(fromDate: Date, toDate: Date): Promise<Installment[]>;
    getOverdueSummary(today?: Date): Promise<{
        totalOverdueInstallments: number;
        totalOverdueAmount: number;
        byDaysRange: {
            '0-10': {
                count: number;
                amount: number;
            };
            '11-30': {
                count: number;
                amount: number;
            };
            '31-60': {
                count: number;
                amount: number;
            };
            '60+': {
                count: number;
                amount: number;
            };
        };
        details: any[];
    }>;
}
