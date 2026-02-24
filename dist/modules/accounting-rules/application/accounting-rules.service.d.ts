import { Repository } from 'typeorm';
import { AccountingRule } from '../../accounting-rules/domain/accounting-rule.entity';
export interface CreateAccountingRuleDto {
    companyId: string;
    appliesTo: 'TRANSACTION' | 'TRANSACTION_LINE';
    transactionType: string;
    expenseCategoryId?: string;
    taxId?: string;
    paymentMethod?: string;
    debitAccountId: string;
    creditAccountId: string;
    priority: number;
    isActive?: boolean;
}
export interface UpdateAccountingRuleDto {
    expenseCategoryId?: string;
    taxId?: string;
    paymentMethod?: string;
    debitAccountId?: string;
    creditAccountId?: string;
    priority?: number;
    isActive?: boolean;
}
export declare class AccountingRulesService {
    private rulesRepo;
    constructor(rulesRepo: Repository<AccountingRule>);
    create(dto: CreateAccountingRuleDto): Promise<AccountingRule>;
    findAll(companyId: string): Promise<AccountingRule[]>;
    findById(id: string): Promise<AccountingRule | null>;
    update(id: string, dto: UpdateAccountingRuleDto): Promise<AccountingRule>;
    deactivate(id: string): Promise<void>;
    findByTransactionType(companyId: string, transactionType: string): Promise<AccountingRule[]>;
}
