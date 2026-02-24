import "reflect-metadata";
import { Branch } from '../../branches/domain/branch.entity';
import { PointOfSale } from '../../points-of-sale/domain/point-of-sale.entity';
import { CashSession } from '../../cash-sessions/domain/cash-session.entity';
import { Customer } from '../../customers/domain/customer.entity';
import { Supplier } from '../../suppliers/domain/supplier.entity';
import { User } from '../../users/domain/user.entity';
import { ExpenseCategory } from '../../expense-categories/domain/expense-category.entity';
import { ResultCenter } from '../../result-centers/domain/result-center.entity';
import { Shareholder } from '../../shareholders/domain/shareholder.entity';
import { AccountingPeriod } from '../../accounting-periods/domain/accounting-period.entity';
import { Employee } from '../../employees/domain/employee.entity';
import type { TransactionLine } from '../../transaction-lines/domain/transaction-line.entity';
export declare enum TransactionType {
    SALE = "SALE",
    SALE_RETURN = "SALE_RETURN",
    PURCHASE = "PURCHASE",
    PURCHASE_ORDER = "PURCHASE_ORDER",
    PURCHASE_RETURN = "PURCHASE_RETURN",
    TRANSFER_OUT = "TRANSFER_OUT",
    TRANSFER_IN = "TRANSFER_IN",
    ADJUSTMENT_IN = "ADJUSTMENT_IN",
    ADJUSTMENT_OUT = "ADJUSTMENT_OUT",
    PAYMENT_IN = "PAYMENT_IN",
    PAYMENT_OUT = "PAYMENT_OUT",
    SUPPLIER_PAYMENT = "SUPPLIER_PAYMENT",
    EXPENSE_PAYMENT = "EXPENSE_PAYMENT",
    PAYROLL = "PAYROLL",
    PAYMENT_EXECUTION = "PAYMENT_EXECUTION",
    CASH_DEPOSIT = "CASH_DEPOSIT",
    OPERATING_EXPENSE = "OPERATING_EXPENSE",
    CASH_SESSION_OPENING = "CASH_SESSION_OPENING",
    CASH_SESSION_CLOSING = "CASH_SESSION_CLOSING",
    CASH_SESSION_WITHDRAWAL = "CASH_SESSION_WITHDRAWAL",
    CASH_SESSION_DEPOSIT = "CASH_SESSION_DEPOSIT",
    BANK_WITHDRAWAL_TO_SHAREHOLDER = "BANK_WITHDRAWAL_TO_SHAREHOLDER"
}
export declare enum TransactionStatus {
    DRAFT = "DRAFT",
    CONFIRMED = "CONFIRMED",
    PARTIALLY_RECEIVED = "PARTIALLY_RECEIVED",
    RECEIVED = "RECEIVED",
    CANCELLED = "CANCELLED"
}
export declare enum PaymentMethod {
    CASH = "CASH",
    CREDIT_CARD = "CREDIT_CARD",
    DEBIT_CARD = "DEBIT_CARD",
    TRANSFER = "TRANSFER",
    CHECK = "CHECK",
    CREDIT = "CREDIT",
    INTERNAL_CREDIT = "INTERNAL_CREDIT",
    MIXED = "MIXED"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    PARTIAL = "PARTIAL",
    OVERDUE = "OVERDUE",
    VOIDED = "VOIDED"
}
export declare class Transaction {
    id: string;
    documentNumber: string;
    transactionType: TransactionType;
    status: TransactionStatus;
    branchId?: string;
    pointOfSaleId?: string;
    cashSessionId?: string;
    storageId?: string;
    targetStorageId?: string;
    customerId?: string;
    supplierId?: string;
    shareholderId?: string | null;
    employeeId?: string | null;
    expenseCategoryId?: string | null;
    resultCenterId?: string | null;
    userId: string;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
    paymentMethod: PaymentMethod;
    bankAccountKey?: string;
    documentType?: string;
    documentFolio?: string;
    paymentDueDate?: Date;
    paymentStatus?: PaymentStatus;
    accountingPeriodId?: string;
    amountPaid: number;
    changeAmount?: number;
    relatedTransactionId?: string;
    parentTransactionId?: string;
    externalReference?: string;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    branch?: Branch;
    pointOfSale?: PointOfSale;
    cashSession?: CashSession;
    storageEntry?: any;
    targetStorageEntry?: any;
    customer?: Customer;
    supplier?: Supplier;
    shareholder?: Shareholder | null;
    employee?: Employee | null;
    user?: User;
    expenseCategory?: ExpenseCategory | null;
    resultCenter?: ResultCenter | null;
    accountingPeriod?: AccountingPeriod;
    relatedTransaction?: Transaction;
    parent?: Transaction;
    children?: Transaction[];
    lines: TransactionLine[];
}
