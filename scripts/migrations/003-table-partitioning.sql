-- PHASE 4: Table Partitioning Strategy
-- Purpose: Enable horizontal partitioning for large tables (1M+ records)
-- Expected improvement: 40-70% faster queries with proper partition pruning
-- Date: 2026-02-20

-- ==============================================================================
-- IMPORTANT: Partitioning Strategy Overview
-- ==============================================================================
-- 
-- Table partitioning divides a large table into smaller, manageable pieces
-- while maintaining a single logical table interface. MySQL automatically
-- routes queries to the relevant partitions based on the partition key.
--
-- Benefits:
-- 1. Faster queries (only scans relevant partitions)
-- 2. Easier maintenance (archive/delete old partitions)
-- 3. Better index performance (smaller indexes per partition)
-- 4. Parallel query execution across partitions
--
-- When to Apply:
-- - Tables with 1M+ rows
-- - Time-series data (transactions, ledger entries)
-- - Regular archival needs (old financial data)
--
-- Partition Strategy:
-- - RANGE partitioning by date (monthly or yearly)
-- - Keep 2-3 years of data online
-- - Archive older partitions to cold storage
-- ==============================================================================

-- ==============================================================================
-- STEP 1: Partition the 'transactions' table by date (MONTHLY)
-- ==============================================================================

-- WARNING: This operation requires table recreation and can take time on large datasets
-- Test in development first. Consider scheduling during maintenance window.

-- Check current table status
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    DATA_LENGTH / 1024 / 1024 AS data_mb,
    INDEX_LENGTH / 1024 / 1024 AS index_mb
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'flow-store' 
  AND TABLE_NAME IN ('transactions', 'ledger_entries');

-- Create partitioned transactions table (requires backup first!)
-- CAUTION: Uncomment only when ready to partition

/*
-- Step 1: Backup original table
CREATE TABLE transactions_backup LIKE transactions;
INSERT INTO transactions_backup SELECT * FROM transactions;

-- Step 2: Drop and recreate with partitions
ALTER TABLE transactions DROP FOREIGN KEY IF EXISTS FK_transaction_period;
ALTER TABLE transactions DROP FOREIGN KEY IF EXISTS FK_transaction_company;
ALTER TABLE transactions DROP FOREIGN KEY IF EXISTS FK_transaction_branch;

DROP TABLE IF EXISTS transactions_temp;
CREATE TABLE transactions_temp LIKE transactions;

-- Add partitioning to new table
ALTER TABLE transactions_temp
PARTITION BY RANGE (YEAR(date) * 100 + MONTH(date)) (
    -- Historical partitions (adjust based on your data)
    PARTITION p_202301 VALUES LESS THAN (202302),
    PARTITION p_202302 VALUES LESS THAN (202303),
    PARTITION p_202303 VALUES LESS THAN (202304),
    PARTITION p_202304 VALUES LESS THAN (202305),
    PARTITION p_202305 VALUES LESS THAN (202306),
    PARTITION p_202306 VALUES LESS THAN (202307),
    PARTITION p_202307 VALUES LESS THAN (202308),
    PARTITION p_202308 VALUES LESS THAN (202309),
    PARTITION p_202309 VALUES LESS THAN (202310),
    PARTITION p_202310 VALUES LESS THAN (202311),
    PARTITION p_202311 VALUES LESS THAN (202312),
    PARTITION p_202312 VALUES LESS THAN (202401),
    
    -- Current year 2024
    PARTITION p_202401 VALUES LESS THAN (202402),
    PARTITION p_202402 VALUES LESS THAN (202403),
    PARTITION p_202403 VALUES LESS THAN (202404),
    PARTITION p_202404 VALUES LESS THAN (202405),
    PARTITION p_202405 VALUES LESS THAN (202406),
    PARTITION p_202406 VALUES LESS THAN (202407),
    PARTITION p_202407 VALUES LESS THAN (202408),
    PARTITION p_202408 VALUES LESS THAN (202409),
    PARTITION p_202409 VALUES LESS THAN (202410),
    PARTITION p_202410 VALUES LESS THAN (202411),
    PARTITION p_202411 VALUES LESS THAN (202412),
    PARTITION p_202412 VALUES LESS THAN (202501),
    
    -- Current year 2025
    PARTITION p_202501 VALUES LESS THAN (202502),
    PARTITION p_202502 VALUES LESS THAN (202503),
    PARTITION p_202503 VALUES LESS THAN (202504),
    PARTITION p_202504 VALUES LESS THAN (202505),
    PARTITION p_202505 VALUES LESS THAN (202506),
    PARTITION p_202506 VALUES LESS THAN (202507),
    PARTITION p_202507 VALUES LESS THAN (202508),
    PARTITION p_202508 VALUES LESS THAN (202509),
    PARTITION p_202509 VALUES LESS THAN (202510),
    PARTITION p_202510 VALUES LESS THAN (202511),
    PARTITION p_202511 VALUES LESS THAN (202512),
    PARTITION p_202512 VALUES LESS THAN (202601),
    
    -- Current year 2026
    PARTITION p_202601 VALUES LESS THAN (202602),
    PARTITION p_202602 VALUES LESS THAN (202603),
    PARTITION p_202603 VALUES LESS THAN (202604),
    PARTITION p_202604 VALUES LESS THAN (202605),
    PARTITION p_202605 VALUES LESS THAN (202606),
    PARTITION p_202606 VALUES LESS THAN (202607),
    PARTITION p_202607 VALUES LESS THAN (202608),
    PARTITION p_202608 VALUES LESS THAN (202609),
    PARTITION p_202609 VALUES LESS THAN (202610),
    PARTITION p_202610 VALUES LESS THAN (202611),
    PARTITION p_202611 VALUES LESS THAN (202612),
    PARTITION p_202612 VALUES LESS THAN (202701),
    
    -- Future data (fallback)
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- Step 3: Copy data to partitioned table
INSERT INTO transactions_temp SELECT * FROM transactions;

-- Step 4: Rename tables (atomic swap)
RENAME TABLE 
    transactions TO transactions_old,
    transactions_temp TO transactions;

-- Step 5: Restore foreign keys
ALTER TABLE transactions 
    ADD CONSTRAINT FK_transaction_company FOREIGN KEY (companyId) REFERENCES companies(id),
    ADD CONSTRAINT FK_transaction_branch FOREIGN KEY (branchId) REFERENCES branches(id),
    ADD CONSTRAINT FK_transaction_period FOREIGN KEY (periodId) REFERENCES accounting_periods(id);
    
-- Step 6: Verify partitioning
SELECT 
    TABLE_NAME,
    PARTITION_NAME,
    PARTITION_METHOD,
    PARTITION_EXPRESSION,
    TABLE_ROWS
FROM information_schema.PARTITIONS 
WHERE TABLE_SCHEMA = 'flow-store' 
  AND TABLE_NAME = 'transactions'
ORDER BY PARTITION_ORDINAL_POSITION;
*/

-- ==============================================================================
-- STEP 2: Partition the 'ledger_entries' table by date (MONTHLY)
-- ==============================================================================

/*
-- Similar approach for ledger_entries
ALTER TABLE ledger_entries
PARTITION BY RANGE (YEAR(entryDate) * 100 + MONTH(entryDate)) (
    -- Add same partition definitions as transactions table
    -- ... (copy from transactions)
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
*/

-- ==============================================================================
-- STEP 3: Maintenance - Add new partitions for future months
-- ==============================================================================

-- Run this script monthly to add partitions for the next 3 months
-- Example for adding March 2027 partition:
/*
ALTER TABLE transactions 
REORGANIZE PARTITION p_future INTO (
    PARTITION p_202703 VALUES LESS THAN (202704),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

ALTER TABLE ledger_entries 
REORGANIZE PARTITION p_future INTO (
    PARTITION p_202703 VALUES LESS THAN (202704),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
*/

-- ==============================================================================
-- STEP 4: Archive old partitions (e.g., data older than 3 years)
-- ==============================================================================

/*
-- Export old partition data to archive table
CREATE TABLE transactions_archive_2023 AS 
SELECT * FROM transactions PARTITION (p_202301, p_202302, p_202303, p_202304, p_202305, p_202306, p_202307, p_202308, p_202309, p_202310, p_202311, p_202312);

-- Drop old partitions (frees up space)
ALTER TABLE transactions DROP PARTITION p_202301, p_202302, p_202303, p_202304, p_202305, p_202306, p_202307, p_202308, p_202309, p_202310, p_202311, p_202312;
*/

-- ==============================================================================
-- STEP 5: Query optimization with partition pruning
-- ==============================================================================

-- Verify partition pruning is working
-- EXPLAIN will show "partitions: p_202602" when partition pruning works
EXPLAIN SELECT * FROM transactions 
WHERE date >= '2026-02-01' AND date < '2026-03-01';

-- Good query (uses partition pruning):
SELECT * FROM transactions 
WHERE date >= '2026-02-01' AND date < '2026-03-01';

-- Bad query (scans all partitions):
SELECT * FROM transactions 
WHERE YEAR(date) = 2026;  -- Function on partition key prevents pruning

-- Fixed query:
SELECT * FROM transactions 
WHERE date >= '2026-01-01' AND date < '2027-01-01';

-- ==============================================================================
-- Performance Monitoring
-- ==============================================================================

-- Check partition sizes
SELECT 
    PARTITION_NAME,
    TABLE_ROWS,
    DATA_LENGTH / 1024 / 1024 AS data_mb,
    INDEX_LENGTH / 1024 / 1024 AS index_mb,
    CREATE_TIME
FROM information_schema.PARTITIONS 
WHERE TABLE_SCHEMA = 'flow-store' 
  AND TABLE_NAME = 'transactions'
  AND PARTITION_NAME IS NOT NULL
ORDER BY PARTITION_ORDINAL_POSITION DESC
LIMIT 12;

-- Monitor query performance by partition
SELECT 
    PARTITION_NAME,
    COUNT(*) as query_count,
    AVG(query_time) as avg_query_time
FROM mysql.slow_log
WHERE db = 'flow-store'
GROUP BY PARTITION_NAME;
