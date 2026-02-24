import { TransactionCreatedEvent } from '../events/transaction-created.event';
import { InstallmentService } from '../../modules/installments/application/services/installment.service';
import { InstallmentRepository } from '../../modules/installments/infrastructure/installment.repository';
export declare class UpdateInstallmentFromPaymentListener {
    private readonly installmentService;
    private readonly installmentRepo;
    private logger;
    constructor(installmentService: InstallmentService, installmentRepo: InstallmentRepository);
    handlePaymentCreated(event: TransactionCreatedEvent): Promise<void>;
}
