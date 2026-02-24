"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLedger = buildLedger;
exports.normalizeBalanceForPresentation = normalizeBalanceForPresentation;
exports.recordPayment = recordPayment;
exports.postTransactionToLedger = postTransactionToLedger;
const typeorm_1 = require("typeorm");
const accounting_account_entity_1 = require("../../modules/accounting-accounts/domain/accounting-account.entity");
const accounting_rule_entity_1 = require("../../modules/accounting-rules/domain/accounting-rule.entity");
const transaction_entity_1 = require("../../modules/transactions/domain/transaction.entity");
const TRANSACTION_TYPES_WITH_SUBTOTAL_BASE = new Set([
    transaction_entity_1.TransactionType.SALE,
    transaction_entity_1.TransactionType.SALE_RETURN,
    transaction_entity_1.TransactionType.PURCHASE,
    transaction_entity_1.TransactionType.PURCHASE_RETURN,
]);
const INVERT_POLARITY_TYPES = new Set([
    transaction_entity_1.TransactionType.SALE_RETURN,
    transaction_entity_1.TransactionType.PURCHASE_RETURN,
]);
function toNumber(value) {
    if (value === null || value === undefined) {
        return 0;
    }
    const numeric = typeof value === 'string' ? Number(value) : value;
    return Number.isFinite(numeric) ? numeric : 0;
}
function parseMetadata(transaction) {
    if (!transaction || transaction.metadata === null || transaction.metadata === undefined) {
        return {};
    }
    if (typeof transaction.metadata === 'object') {
        return transaction.metadata;
    }
    if (typeof transaction.metadata === 'string') {
        try {
            return JSON.parse(transaction.metadata);
        }
        catch (err) {
            return {};
        }
    }
    return {};
}
function splitRules(rules) {
    const transactionRules = [];
    const lineRules = [];
    for (const rule of rules) {
        if (!rule.isActive) {
            continue;
        }
        if (rule.appliesTo === accounting_rule_entity_1.RuleScope.TRANSACTION) {
            transactionRules.push(rule);
        }
        else {
            lineRules.push(rule);
        }
    }
    return { transactionRules, lineRules };
}
function matchesTransactionRule(rule, transaction) {
    if (rule.transactionType !== transaction.transactionType) {
        return false;
    }
    if (rule.paymentMethod && rule.paymentMethod !== transaction.paymentMethod) {
        return false;
    }
    if (rule.taxId) {
        const metadata = parseMetadata(transaction);
        const transactionTaxId = metadata.taxId ?? metadata.tax_id ?? null;
        if (transactionTaxId !== rule.taxId) {
            return false;
        }
    }
    return true;
}
function matchesLineRule(rule, line, transaction) {
    if (rule.transactionType && transaction && rule.transactionType !== transaction.transactionType) {
        return false;
    }
    if (rule.paymentMethod && transaction && rule.paymentMethod !== transaction.paymentMethod) {
        return false;
    }
    if (rule.taxId && line.taxId !== rule.taxId) {
        return false;
    }
    return true;
}
function resolveTransactionAmount(rule, transaction) {
    let baseAmount;
    if (TRANSACTION_TYPES_WITH_SUBTOTAL_BASE.has(transaction.transactionType)) {
        baseAmount = toNumber(transaction.subtotal);
    }
    else {
        baseAmount = toNumber(transaction.total);
    }
    if (INVERT_POLARITY_TYPES.has(transaction.transactionType)) {
        baseAmount *= -1;
    }
    if (!Number.isFinite(baseAmount) || baseAmount === 0) {
        return 0;
    }
    return baseAmount;
}
function resolveLineAmount(transaction, line) {
    let amount = toNumber(line.taxAmount);
    if (amount === 0) {
        amount = toNumber(line.subtotal);
    }
    if (INVERT_POLARITY_TYPES.has(transaction.transactionType)) {
        amount *= -1;
    }
    return amount;
}
function createPostingId(transactionId, ruleId, accountId, postfix) {
    return `${transactionId}:${ruleId}:${accountId}:${postfix}`;
}
function applyAmountToAccounts(amount, debitAccount, creditAccount, payload, accumulator) {
    if (!Number.isFinite(amount) || amount === 0) {
        return;
    }
    const magnitude = Math.abs(amount);
    const debitPosting = {
        id: createPostingId(payload.transaction.id, payload.rule.id, debitAccount.id, amount >= 0 ? 'D' : 'CR'),
        transactionId: payload.transaction.id,
        ruleId: payload.rule.id,
        scope: payload.rule.appliesTo,
        accountId: debitAccount.id,
        accountCode: debitAccount.code,
        accountName: debitAccount.name,
        date: payload.transaction.createdAt.toISOString(),
        reference: payload.reference,
        description: payload.description,
        debit: amount >= 0 ? magnitude : 0,
        credit: amount >= 0 ? 0 : magnitude,
    };
    const creditPosting = {
        id: createPostingId(payload.transaction.id, payload.rule.id, creditAccount.id, amount >= 0 ? 'C' : 'DR'),
        transactionId: payload.transaction.id,
        ruleId: payload.rule.id,
        scope: payload.rule.appliesTo,
        accountId: creditAccount.id,
        accountCode: creditAccount.code,
        accountName: creditAccount.name,
        date: payload.transaction.createdAt.toISOString(),
        reference: payload.reference,
        description: payload.description,
        debit: amount >= 0 ? 0 : magnitude,
        credit: amount >= 0 ? magnitude : 0,
    };
    accumulator.push(debitPosting, creditPosting);
}
function groupLinesByTransaction(lines) {
    const map = new Map();
    for (const line of lines) {
        if (!line.transactionId) {
            continue;
        }
        const bucket = map.get(line.transactionId) ?? [];
        bucket.push(line);
        map.set(line.transactionId, bucket);
    }
    return map;
}
function sumLineAmounts(rule, transaction, lines) {
    let amount = 0;
    for (const line of lines) {
        if (!matchesLineRule(rule, line, transaction)) {
            continue;
        }
        amount += resolveLineAmount(transaction, line);
    }
    return amount;
}
const resolveRepositoryTarget = (maybeDsOrManager, cls, name) => {
    try {
        let ds = undefined;
        if (!maybeDsOrManager) {
            ds = globalThis.globalDataSource;
        }
        else if (maybeDsOrManager instanceof typeorm_1.DataSource) {
            ds = maybeDsOrManager;
        }
        else if (typeof maybeDsOrManager.hasMetadata === 'function') {
            ds = maybeDsOrManager;
        }
        else if (maybeDsOrManager.connection) {
            ds = maybeDsOrManager.connection;
        }
        else if (maybeDsOrManager.dataSource) {
            ds = maybeDsOrManager.dataSource;
        }
        else if (globalThis.globalDataSource) {
            ds = globalThis.globalDataSource;
        }
        if (!ds)
            return cls;
        if (ds.hasMetadata && ds.hasMetadata(cls))
            return cls;
        if (name && ds.hasMetadata && ds.hasMetadata(name))
            return name;
        return cls;
    }
    catch (err) {
        return cls;
    }
};
async function buildLedger(dataSource, params) {
    const accountRepo = dataSource.getRepository("AccountingAccount");
    const ruleRepo = dataSource.getRepository("AccountingRule");
    const transactionRepo = dataSource.getRepository("Transaction");
    const lineRepo = dataSource.getRepository("TransactionLine");
    const accounts = await accountRepo.find({
        where: { companyId: params.companyId },
        order: { code: 'ASC' },
    });
    if (accounts.length === 0) {
        return {
            accounts,
            postings: [],
            balanceByAccount: {},
        };
    }
    const accountsById = new Map(accounts.map((account) => [account.id, account]));
    const rules = await ruleRepo.find({
        where: { companyId: params.companyId },
        order: { priority: 'ASC' },
    });
    if (rules.length === 0) {
        return {
            accounts,
            postings: [],
            balanceByAccount: Object.fromEntries(accounts.map((account) => [account.id, 0])),
        };
    }
    const { transactionRules, lineRules } = splitRules(rules);
    if (transactionRules.length === 0 && lineRules.length === 0) {
        return {
            accounts,
            postings: [],
            balanceByAccount: Object.fromEntries(accounts.map((account) => [account.id, 0])),
        };
    }
    const relevantTypes = new Set();
    for (const rule of rules) {
        relevantTypes.add(rule.transactionType);
    }
    const transactionQuery = transactionRepo
        .createQueryBuilder('transaction')
        .leftJoin('transaction.branch', 'branch')
        .where('transaction.status = :status', { status: transaction_entity_1.TransactionStatus.CONFIRMED })
        .andWhere('transaction.transactionType IN (:...types)', { types: Array.from(relevantTypes) })
        .andWhere('(branch.companyId = :companyId OR branch.companyId IS NULL)', { companyId: params.companyId })
        .orderBy('transaction.createdAt', 'ASC');
    if (params.from) {
        transactionQuery.andWhere('transaction.createdAt >= :from', { from: params.from });
    }
    if (params.to) {
        transactionQuery.andWhere('transaction.createdAt <= :to', { to: params.to });
    }
    if (params.resultCenterId) {
        const ccRepo = dataSource.getRepository("ResultCenter");
        const allCCs = await ccRepo.find({ where: { companyId: params.companyId } });
        const idSet = new Set();
        idSet.add(params.resultCenterId);
        const addDescendants = (parentId) => {
            allCCs.filter(cc => cc.parentId === parentId).forEach(child => {
                idSet.add(child.id);
                addDescendants(child.id);
            });
        };
        addDescendants(params.resultCenterId);
        const targetIds = Array.from(idSet);
        transactionQuery.andWhere('transaction.resultCenterId IN (:...targetIds)', { targetIds });
    }
    if (params.limitTransactions && params.limitTransactions > 0) {
        transactionQuery.take(params.limitTransactions);
    }
    const transactions = await transactionQuery.getMany();
    if (transactions.length === 0) {
        return {
            accounts,
            postings: [],
            balanceByAccount: Object.fromEntries(accounts.map((account) => [account.id, 0])),
        };
    }
    const lines = lineRules.length > 0
        ? await lineRepo.find({
            where: { transactionId: (0, typeorm_1.In)(transactions.map((tx) => tx.id)) },
        })
        : [];
    const linesMap = groupLinesByTransaction(lines);
    const postings = [];
    for (const transaction of transactions) {
        const reference = transaction.documentNumber || transaction.externalReference || transaction.id;
        const description = transaction.notes || transaction.transactionType;
        const linesForTransaction = linesMap.get(transaction.id) ?? [];
        for (const rule of transactionRules) {
            if (!matchesTransactionRule(rule, transaction)) {
                continue;
            }
            const debitAccount = accountsById.get(rule.debitAccountId);
            const creditAccount = accountsById.get(rule.creditAccountId);
            if (!debitAccount || !creditAccount) {
                continue;
            }
            const amount = resolveTransactionAmount(rule, transaction);
            if (transaction.transactionType === transaction_entity_1.TransactionType.PURCHASE && (!amount || amount === 0)) {
                console.warn(`[AccountingEngine] Regla de transacción para PURCHASE resolvió monto 0. transactionId=${transaction.id} subtotal=${transaction.subtotal}`);
            }
            applyAmountToAccounts(amount, debitAccount, creditAccount, {
                transaction,
                rule,
                reference,
                description,
            }, postings);
        }
        if (linesForTransaction.length === 0 || lineRules.length === 0) {
            continue;
        }
        for (const rule of lineRules) {
            if (rule.transactionType !== transaction.transactionType) {
                continue;
            }
            const debitAccount = accountsById.get(rule.debitAccountId);
            const creditAccount = accountsById.get(rule.creditAccountId);
            if (!debitAccount || !creditAccount) {
                continue;
            }
            const amount = sumLineAmounts(rule, transaction, linesForTransaction);
            applyAmountToAccounts(amount, debitAccount, creditAccount, {
                transaction: transaction,
                rule,
                reference,
                description,
            }, postings);
        }
    }
    const ledgerRepo = dataSource.getRepository("LedgerEntry");
    const ledgerEntries = await ledgerRepo.find({
        where: { account: { companyId: params.companyId } },
        relations: ['account', 'transaction'],
        order: { entryDate: 'ASC', id: 'ASC' },
    });
    for (const entry of ledgerEntries) {
        if (!accountsById.has(entry.accountId)) {
            continue;
        }
        const account = accountsById.get(entry.accountId);
        postings.push({
            id: entry.id,
            transactionId: entry.transactionId,
            ruleId: null,
            scope: accounting_rule_entity_1.RuleScope.TRANSACTION,
            accountId: entry.accountId,
            accountCode: account.code,
            accountName: account.name,
            date: entry.entryDate.toISOString().split('T')[0],
            reference: entry.transaction?.documentNumber || entry.transaction?.externalReference || entry.transaction?.id || entry.id,
            description: entry.description,
            debit: entry.debit,
            credit: entry.credit,
        });
    }
    postings.sort((a, b) => {
        if (a.date === b.date) {
            return a.id.localeCompare(b.id);
        }
        return a.date.localeCompare(b.date);
    });
    const balanceMap = new Map();
    for (const account of accounts) {
        balanceMap.set(account.id, 0);
    }
    for (const posting of postings) {
        const current = balanceMap.get(posting.accountId) ?? 0;
        balanceMap.set(posting.accountId, current + posting.debit - posting.credit);
    }
    return {
        accounts,
        postings,
        balanceByAccount: Object.fromEntries(balanceMap),
    };
}
function normalizeBalanceForPresentation(type, balance) {
    switch (type) {
        case accounting_account_entity_1.AccountType.ASSET:
        case accounting_account_entity_1.AccountType.EXPENSE:
            return balance;
        case accounting_account_entity_1.AccountType.LIABILITY:
        case accounting_account_entity_1.AccountType.EQUITY:
        case accounting_account_entity_1.AccountType.INCOME:
            return balance * -1;
        default:
            return balance;
    }
}
async function recordPayment(manager, transaction, bankAccountId) {
    const paymentMethod = transaction.paymentMethod;
    const amount = transaction.total;
    switch (paymentMethod) {
        case 'CASH':
            await createBasicPosting(manager, transaction, '1.1.01', '4.1.01', amount);
            break;
        case 'CREDIT_CARD':
            await createBasicPosting(manager, transaction, '1.1.02', '4.1.01', amount);
            break;
        case 'DEBIT_CARD':
            await createBasicPosting(manager, transaction, '1.1.02', '4.1.01', amount);
            break;
        case 'TRANSFER':
            if (transaction.transactionType === 'PAYMENT_OUT') {
                await createBasicPosting(manager, transaction, '1.1.01', '1.1.02', amount);
            }
            else {
                await createBasicPosting(manager, transaction, '1.1.02', '4.1.01', amount);
            }
            break;
        case 'INTERNAL_CREDIT':
            await createBasicPosting(manager, transaction, '1.1.03', '4.1.01', amount);
            break;
        default:
            await createBasicPosting(manager, transaction, '1.1.01', '4.1.01', amount);
    }
}
async function createBasicPosting(manager, transaction, debitAccountCode, creditAccountCode, amount) {
    const debitAccount = await manager.getRepository("AccountingAccount").findOne({
        where: { code: debitAccountCode }
    });
    const creditAccount = await manager.getRepository("AccountingAccount").findOne({
        where: { code: creditAccountCode }
    });
    if (!debitAccount || !creditAccount) {
        console.warn(`Cuentas contables no encontradas: ${debitAccountCode}, ${creditAccountCode}`);
        return;
    }
    const debitPosting = {
        transactionId: transaction.id,
        accountId: debitAccount.id,
        date: transaction.createdAt.toISOString().split('T')[0],
        reference: transaction.documentNumber,
        description: `Pago ${transaction.paymentMethod}`,
        debit: amount,
        credit: 0,
    };
    const creditPosting = {
        transactionId: transaction.id,
        accountId: creditAccount.id,
        date: transaction.createdAt.toISOString().split('T')[0],
        reference: transaction.documentNumber,
        description: `Pago ${transaction.paymentMethod}`,
        debit: 0,
        credit: amount,
    };
}
async function postTransactionToLedger(manager, transactionId) {
    try {
        const transactionRepo = manager.getRepository("Transaction");
        const lineRepo = manager.getRepository("TransactionLine");
        const ruleRepo = manager.getRepository("AccountingRule");
        const accountRepo = manager.getRepository("AccountingAccount");
        const ledgerRepo = manager.getRepository("LedgerEntry");
        const transaction = await transactionRepo.findOne({
            where: { id: transactionId },
            relations: ['branch', 'customer', 'supplier', 'shareholder', 'employee']
        });
        if (!transaction || transaction.status !== transaction_entity_1.TransactionStatus.CONFIRMED) {
            return { success: false, error: 'Transacción no encontrada o no confirmada' };
        }
        await ledgerRepo.delete({ transactionId });
        const rules = await ruleRepo.find({
            where: { isActive: true },
            order: { priority: 'ASC' }
        });
        const { transactionRules, lineRules } = splitRules(rules);
        const accounts = await accountRepo.find();
        const accountsById = new Map(accounts.map((a) => [a.id, a]));
        const lines = await lineRepo.find({ where: { transactionId } });
        const localPostings = [];
        const reference = transaction.documentNumber || transaction.externalReference || transaction.id;
        const description = transaction.notes || `Asiento derivado de ${transaction.transactionType}`;
        let personId = null;
        if (transaction.customer) {
            personId = transaction.customer.personId;
        }
        else if (transaction.supplier) {
            personId = transaction.supplier.personId;
        }
        else if (transaction.shareholder) {
            personId = transaction.shareholder.personId;
        }
        else if (transaction.employee) {
            personId = transaction.employee.personId;
        }
        if (!personId) {
            if (transaction.supplierId) {
                const s = await manager.getRepository("Supplier").findOne({ where: { id: transaction.supplierId } });
                if (s)
                    personId = s.personId;
            }
            else if (transaction.customerId) {
                const c = await manager.getRepository("Customer").findOne({ where: { id: transaction.customerId } });
                if (c)
                    personId = c.personId;
            }
            else if (transaction.employeeId) {
                const e = await manager.getRepository("Employee").findOne({ where: { id: transaction.employeeId } });
                if (e)
                    personId = e.personId;
            }
        }
        const metadata = parseMetadata(transaction);
        let specialHandlingApplied = false;
        if (metadata.transfer && metadata.transfer.destinationAccountCode === '1.1.01') {
            const cashAccount = accounts.find(a => a.code === '1.1.01');
            const bankAccount = accounts.find(a => a.code === '1.1.02');
            if (cashAccount && bankAccount) {
                const amount = Math.abs(Number(transaction.total));
                localPostings.push({
                    transactionId,
                    entryDate: transaction.createdAt,
                    description: description,
                    personId: null,
                    accountId: cashAccount.id,
                    debit: amount,
                    credit: 0
                });
                localPostings.push({
                    transactionId,
                    entryDate: transaction.createdAt,
                    description: description,
                    personId: null,
                    accountId: bankAccount.id,
                    debit: 0,
                    credit: amount
                });
                specialHandlingApplied = true;
            }
        }
        if (metadata.capitalContribution && !specialHandlingApplied) {
            const bankAccount = accounts.find(a => a.code === '1.1.02');
            const capitalAccount = accounts.find(a => a.code === '3.1.01');
            if (bankAccount && capitalAccount) {
                const amount = Math.abs(Number(transaction.total));
                localPostings.push({ transactionId, entryDate: transaction.createdAt, description: description, personId: personId, accountId: bankAccount.id, debit: amount, credit: 0 });
                localPostings.push({ transactionId, entryDate: transaction.createdAt, description: description, personId: personId, accountId: capitalAccount.id, debit: 0, credit: amount });
                specialHandlingApplied = true;
            }
        }
        if (metadata.bankWithdrawalToShareholder && !specialHandlingApplied) {
            const bankAccount = accounts.find(a => a.code === '1.1.02');
            const capitalAccount = accounts.find(a => a.code === '3.1.01');
            if (bankAccount && capitalAccount) {
                const amount = Math.abs(Number(transaction.total));
                localPostings.push({ transactionId, entryDate: transaction.createdAt, description: description, personId: personId, accountId: capitalAccount.id, debit: amount, credit: 0 });
                localPostings.push({ transactionId, entryDate: transaction.createdAt, description: description, personId: personId, accountId: bankAccount.id, debit: 0, credit: amount });
                specialHandlingApplied = true;
            }
        }
        if (!specialHandlingApplied) {
            for (const rule of transactionRules) {
                if (!matchesTransactionRule(rule, transaction))
                    continue;
                const debitAccount = accountsById.get(rule.debitAccountId);
                const creditAccount = accountsById.get(rule.creditAccountId);
                if (!debitAccount || !creditAccount)
                    continue;
                const amount = resolveTransactionAmount(rule, transaction);
                if (amount !== 0) {
                    const magnitude = Math.abs(amount);
                    const debit = amount >= 0 ? magnitude : 0;
                    const credit = amount >= 0 ? magnitude : 0;
                    const baseEntry = {
                        transactionId,
                        entryDate: transaction.createdAt,
                        description: description,
                        personId: rule.appliesTo === accounting_rule_entity_1.RuleScope.TRANSACTION ? personId : null,
                    };
                    localPostings.push({ ...baseEntry, accountId: debitAccount.id, debit, credit: 0 });
                    localPostings.push({ ...baseEntry, accountId: creditAccount.id, debit: 0, credit });
                }
            }
        }
        for (const rule of lineRules) {
            const amount = sumLineAmounts(rule, transaction, lines);
            if (amount === 0)
                continue;
            const debitAccount = accountsById.get(rule.debitAccountId);
            const creditAccount = accountsById.get(rule.creditAccountId);
            if (!debitAccount || !creditAccount)
                continue;
            const magnitude = Math.abs(amount);
            const debit = amount >= 0 ? magnitude : 0;
            const credit = amount >= 0 ? magnitude : 0;
            const baseEntry = {
                transactionId,
                entryDate: transaction.createdAt,
                description: description,
                personId: null,
            };
            localPostings.push({ ...baseEntry, accountId: debitAccount.id, debit, credit: 0 });
            localPostings.push({ ...baseEntry, accountId: creditAccount.id, debit: 0, credit });
        }
        const roundingUnit = (transaction.metadata && transaction.metadata.roundingUnit) ? Number(transaction.metadata.roundingUnit) : 10;
        try {
            const unroundedTotal = Math.round(Number(transaction.total));
            const { roundHalfUp } = await Promise.resolve(require('../../lib/rounding'));
            const roundedTotal = roundHalfUp(unroundedTotal, roundingUnit);
            const roundDiff = roundedTotal - unroundedTotal;
            if (roundDiff !== 0) {
                const roundingAccount = accounts.find(a => a.code === '8.9.99') || accounts[0];
                const counterAccount = accounts.find(a => a.code === '1.1.01') || accounts.find(a => a.code === '4.1.01') || accounts[0];
                const baseEntry = {
                    transactionId,
                    entryDate: transaction.createdAt,
                    description: `${description} (Ajuste por redondeo)`,
                    personId: null,
                };
                const magnitude = Math.abs(roundDiff);
                if (roundDiff > 0) {
                    localPostings.push({ ...baseEntry, accountId: roundingAccount.id, debit: magnitude, credit: 0, metadata: { amount_unrounded: unroundedTotal, roundingUnit } });
                    localPostings.push({ ...baseEntry, accountId: counterAccount.id, debit: 0, credit: magnitude });
                }
                else {
                    localPostings.push({ ...baseEntry, accountId: roundingAccount.id, debit: 0, credit: magnitude, metadata: { amount_unrounded: unroundedTotal, roundingUnit } });
                    localPostings.push({ ...baseEntry, accountId: counterAccount.id, debit: magnitude, credit: 0 });
                }
            }
        }
        catch (err) {
            console.warn('Skipping rounding due to error calculating rounding:', err);
        }
        if (localPostings.length === 0) {
            if (transaction.transactionType === transaction_entity_1.TransactionType.OPERATING_EXPENSE) {
                const expenseAccountId = accounts.find(a => a.code === '5.2.03')?.id;
                const proveedoresAccountId = accounts.find(a => a.code === '2.1.01')?.id;
                const ivaCreditoAccountId = accounts.find(a => a.code === '1.1.05')?.id;
                const subtotal = Number(transaction.subtotal ?? 0);
                const tax = Number(transaction.taxAmount ?? 0);
                const totalForTx = Number(transaction.total ?? 0);
                if (expenseAccountId && proveedoresAccountId) {
                    const baseEntry = {
                        transactionId,
                        entryDate: transaction.createdAt,
                        description: description,
                        personId: personId,
                    };
                    if (subtotal > 0) {
                        localPostings.push({ ...baseEntry, accountId: expenseAccountId, debit: subtotal, credit: 0 });
                    }
                    if (tax > 0 && ivaCreditoAccountId) {
                        localPostings.push({ ...baseEntry, accountId: ivaCreditoAccountId, debit: tax, credit: 0 });
                    }
                    localPostings.push({ ...baseEntry, accountId: proveedoresAccountId, debit: 0, credit: totalForTx });
                }
            }
            if (localPostings.length === 0) {
                const amount = resolveTransactionAmount({}, transaction);
                if (amount !== 0) {
                    const magnitude = Math.abs(amount);
                    let debitAccountId;
                    let creditAccountId;
                    if (transaction.transactionType === transaction_entity_1.TransactionType.PAYMENT_OUT) {
                        debitAccountId = accounts.find(a => a.code === '2.1.01')?.id;
                        if (transaction.paymentMethod === 'CASH') {
                            creditAccountId = accounts.find(a => a.code === '1.1.01')?.id;
                        }
                        else if (transaction.paymentMethod === 'TRANSFER') {
                            creditAccountId = accounts.find(a => a.code === '1.1.02')?.id;
                        }
                        else {
                            creditAccountId = accounts.find(a => a.code === '1.1.02')?.id;
                        }
                    }
                    else {
                        if (transaction.paymentMethod === 'CASH') {
                            debitAccountId = accounts.find(a => a.code === '1.1.01')?.id;
                            creditAccountId = accounts.find(a => a.code === '4.1.01')?.id;
                        }
                        else if (transaction.paymentMethod === 'TRANSFER') {
                            debitAccountId = accounts.find(a => a.code === '1.1.02')?.id;
                            creditAccountId = accounts.find(a => a.code === '4.1.01')?.id;
                        }
                        else {
                            debitAccountId = accounts.find(a => a.code === '1.1.01')?.id;
                            creditAccountId = accounts.find(a => a.code === '4.1.01')?.id;
                        }
                    }
                    if (debitAccountId && creditAccountId) {
                        const baseEntry = {
                            transactionId,
                            entryDate: transaction.createdAt,
                            description: description,
                            personId: personId,
                        };
                        localPostings.push({ ...baseEntry, accountId: debitAccountId, debit: magnitude, credit: 0 });
                        localPostings.push({ ...baseEntry, accountId: creditAccountId, debit: 0, credit: magnitude });
                    }
                }
            }
        }
        if (localPostings.length > 0) {
            try {
                const filtered = localPostings.filter(p => {
                    const d = Number(p.debit || 0);
                    const c = Number(p.credit || 0);
                    return (d !== 0 || c !== 0);
                });
                if (filtered.length !== localPostings.length) {
                    console.warn(`[AccountingEngine] Se eliminaron ${localPostings.length - filtered.length} asientos con importe 0 para transaction ${transactionId}`);
                }
                if (filtered.length === 0) {
                    console.warn(`[AccountingEngine] No hay asientos válidos para persistir en transaction ${transactionId}, omitiendo persistencia.`);
                }
                else {
                    console.debug(`[AccountingEngine] Persistiendo ${filtered.length} asientos para transaction ${transactionId}`);
                    for (const p of filtered) {
                        const acc = accountsById.get(p.accountId);
                        const desc = p.description ?? '';
                        console.debug(`[AccountingEngine] Posting -> accountCode=${acc?.code ?? p.accountId} debit=${p.debit} credit=${p.credit} description=${desc}`);
                    }
                    await ledgerRepo.save(filtered);
                }
            }
            catch (err) {
                console.error('[AccountingEngine] Error guardando asientos del libro:', err);
                throw err;
            }
        }
        return { success: true };
    }
    catch (error) {
        console.error('Error posting transaction to ledger:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
}
exports.default = {
    buildLedger,
    normalizeBalanceForPresentation,
    recordPayment,
    postTransactionToLedger,
};
//# sourceMappingURL=AccountingEngine.js.map