-- PHASE 2: Account Balance Aggregation Table
-- Purpose: Pre-calculate and store balances instead of summing ledger entries
-- Expected improvement: 300x faster (30s -> 100ms for balance sheet)
-- Date: 2026-02-20

-- Create account_balances table
CREATE TABLE IF NOT EXISTS account_balances (
    id VARCHAR(36) PRIMARY KEY,
    companyId VARCHAR(36) NOT NULL,
    accountId VARCHAR(36) NOT NULL,
    periodId VARCHAR(36) NOT NULL,
    
    -- Opening balances (from previous period)
    openingDebit DECIMAL(15, 2) DEFAULT 0 NOT NULL,
    openingCredit DECIMAL(15, 2) DEFAULT 0 NOT NULL,
    
    -- Period movements (sum of ledger entries this period)
    periodDebit DECIMAL(15, 2) DEFAULT 0 NOT NULL,
    periodCredit DECIMAL(15, 2) DEFAULT 0 NOT NULL,
    
    -- Closing balances (opening + period)
    closingDebit DECIMAL(15, 2) DEFAULT 0 NOT NULL,
    closingCredit DECIMAL(15, 2) DEFAULT 0 NOT NULL,
    
    -- Immutability control
    frozen BOOLEAN DEFAULT FALSE NOT NULL,
    frozenAt DATETIME NULL,
    
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT UQ_account_balance_account_period UNIQUE (accountId, periodId),
    CONSTRAINT FK_account_balance_company FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE RESTRICT,
    CONSTRAINT FK_account_balance_account FOREIGN KEY (accountId) REFERENCES accounting_accounts(id) ON DELETE RESTRICT,
    CONSTRAINT FK_account_balance_period FOREIGN KEY (periodId) REFERENCES accounting_periods(id) ON DELETE RESTRICT,
    
    -- Indexes for fast lookups
    INDEX idx_account_balances_company_period (companyId, periodId),
    INDEX idx_account_balances_account_period (accountId, periodId),
    INDEX idx_account_balances_frozen (frozen, periodId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initialize balances for existing periods
-- This script calculates opening and period balances from existing ledger entries
INSERT INTO account_balances (
    id,
    companyId,
    accountId,
    periodId,
    openingDebit,
    openingCredit,
    periodDebit,
    periodCredit,
    closingDebit,
    closingCredit,
    frozen
)
SELECT 
    UUID() as id,
    le.companyId,
    le.accountId,
    t.periodId,
    0 as openingDebit,  -- Initialize as 0, will be calculated from previous periods
    0 as openingCredit,
    SUM(le.debit) as periodDebit,
    SUM(le.credit) as periodCredit,
    SUM(le.debit) as closingDebit,  -- For first period, closing = period movement
    SUM(le.credit) as closingCredit,
    FALSE as frozen
FROM ledger_entries le
INNER JOIN transactions t ON le.transactionId = t.id
WHERE t.periodId IS NOT NULL
GROUP BY le.companyId, le.accountId, t.periodId
ON DUPLICATE KEY UPDATE
    periodDebit = VALUES(periodDebit),
    periodCredit = VALUES(periodCredit),
    closingDebit = VALUES(closingDebit),
    closingCredit = VALUES(closingCredit),
    updatedAt = NOW();

-- Verify balances created
SELECT 
    c.name as company,
    aa.code as account_code,
    aa.name as account_name,
    ap.name as period_name,
    ab.periodDebit,
    ab.periodCredit,
    ab.closingDebit - ab.closingCredit as netBalance
FROM account_balances ab
INNER JOIN companies c ON ab.companyId = c.id
INNER JOIN accounting_accounts aa ON ab.accountId = aa.id
INNER JOIN accounting_periods ap ON ab.periodId = ap.id
ORDER BY c.name, aa.code, ap.startDate
LIMIT 20;
