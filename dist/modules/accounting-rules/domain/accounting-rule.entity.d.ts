import "reflect-metadata";
import { Company } from '@modules/companies/domain/company.entity';
import { AccountingAccount } from '@modules/accounting-accounts/domain/accounting-account.entity';
import { ExpenseCategory } from '@modules/expense-categories/domain/expense-category.entity';
import { Tax } from '@modules/taxes/domain/tax.entity';
import { TransactionType, PaymentMethod } from '@modules/transactions/domain/transaction.entity';
export declare enum RuleScope {
    TRANSACTION = "TRANSACTION",
    TRANSACTION_LINE = "TRANSACTION_LINE"
}
export declare class AccountingRule {
    id: string;
    companyId: string;
    appliesTo: RuleScope;
    transactionType: TransactionType;
    expenseCategoryId?: string | null;
    taxId?: string | null;
    paymentMethod?: PaymentMethod | null;
    debitAccountId: string;
    creditAccountId: string;
    priority: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    company: Company;
    expenseCategory?: ExpenseCategory | null;
    tax?: Tax | null;
    debitAccount: AccountingAccount;
    creditAccount: AccountingAccount;
}
