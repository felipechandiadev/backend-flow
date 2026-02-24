import { AccountingRulesService, CreateAccountingRuleDto, UpdateAccountingRuleDto } from '@modules/accounting-rules/application/accounting-rules.service';
export declare class AccountingRulesController {
    private service;
    constructor(service: AccountingRulesService);
    create(dto: CreateAccountingRuleDto): Promise<import("../domain/accounting-rule.entity").AccountingRule>;
    findAll(companyId: string): Promise<import("../domain/accounting-rule.entity").AccountingRule[] | {
        error: string;
    }>;
    findById(id: string): Promise<import("../domain/accounting-rule.entity").AccountingRule | null>;
    update(id: string, dto: UpdateAccountingRuleDto): Promise<import("../domain/accounting-rule.entity").AccountingRule>;
    delete(id: string): Promise<{
        message: string;
    }>;
    findByTransactionType(transactionType: string, companyId: string): Promise<import("../domain/accounting-rule.entity").AccountingRule[] | {
        error: string;
    }>;
}
