import { TransactionCreatedEvent } from '../events/transaction-created.event';
import { InstallmentService } from '../../modules/installments/application/services/installment.service';
export declare class CreateInstallmentsListener {
    private readonly installmentService;
    private logger;
    constructor(installmentService: InstallmentService);
    handleTransactionCreated(event: TransactionCreatedEvent): Promise<void>;
    private handleSaleOrPurchaseInstallments;
    private handlePayrollInstallment;
    private handleOperatingExpenseInstallment;
    private getDefaultDueDate;
}
