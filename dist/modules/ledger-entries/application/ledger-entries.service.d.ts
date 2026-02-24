import { EntityManager, Repository } from 'typeorm';
import { LedgerEntry } from '../../ledger-entries/domain/ledger-entry.entity';
import { Transaction } from '../../transactions/domain/transaction.entity';
import { AccountingRule } from '../../accounting-rules/domain/accounting-rule.entity';
import { AccountingAccount } from '../../accounting-accounts/domain/accounting-account.entity';
import { Customer } from '../../customers/domain/customer.entity';
import { Supplier } from '../../suppliers/domain/supplier.entity';
import { Shareholder } from '../../shareholders/domain/shareholder.entity';
import { Employee } from '../../employees/domain/employee.entity';
interface ValidationError {
    code: string;
    message: string;
    severity: 'ERROR' | 'WARNING';
    phase: 'VALIDATION' | 'MATCHING' | 'GENERATION' | 'BALANCE_CHECK' | 'PERSISTENCE';
}
export interface LedgerEntryGeneratorResponse {
    status: 'SUCCESS' | 'PARTIAL_SUCCESS' | 'REJECTED';
    transactionId: string;
    entriesGenerated?: number;
    entriesIds?: string[];
    balanceValidated?: boolean;
    errors: ValidationError[];
    executedAt: Date;
    executionTimeMs: number;
}
export declare class LedgerEntriesService {
    private ledgerRepo;
    private rulesRepo;
    private accountRepo;
    private customerRepo;
    private supplierRepo;
    private shareholderRepo;
    private employeeRepo;
    private logger;
    constructor(ledgerRepo: Repository<LedgerEntry>, rulesRepo: Repository<AccountingRule>, accountRepo: Repository<AccountingAccount>, customerRepo: Repository<Customer>, supplierRepo: Repository<Supplier>, shareholderRepo: Repository<Shareholder>, employeeRepo: Repository<Employee>);
    generateEntriesForTransaction(transaction: Transaction, companyId: string, manager?: EntityManager): Promise<LedgerEntryGeneratorResponse>;
    private preValidateTransaction;
    private matchRules;
    private calculateEntries;
    private generatePayrollEntries;
    private getPayrollAccountMap;
    private mapPayrollTypeToExpenseAccount;
    private mapPayrollTypeToLiabilityAccount;
    private getPayrollTypeName;
    private generatePaymentExecutionEntries;
    private getPaymentExecutionAccountMap;
    private getCashAccountForPaymentMethod;
    private validateBalance;
    private sumDebits;
    private sumCredits;
    private persistEntries;
    private getPersonIdForTransaction;
    private getTransactionAmount;
    private getLineAmount;
    private generateDescription;
    getAccountBalance(accountId: string, beforeDate: Date, _companyId?: string): Promise<number>;
    getPersonBalance(personId: string, personType: 'CUSTOMER' | 'SUPPLIER' | 'SHAREHOLDER' | 'EMPLOYEE', _companyId?: string): Promise<number>;
}
export {};
