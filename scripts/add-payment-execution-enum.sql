-- Agregar PAYMENT_EXECUTION al enum de transactionType
-- Ejecutar con: mysql -u root -p flow_store < scripts/add-payment-execution-enum.sql

USE flow_store;

-- Verificar el enum actual
SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'flow_store' 
  AND TABLE_NAME = 'transactions' 
  AND COLUMN_NAME = 'transactionType';

-- Agregar PAYMENT_EXECUTION al enum
ALTER TABLE transactions 
MODIFY COLUMN transactionType ENUM(
  'SALE',
  'PURCHASE',
  'PAYMENT_IN',
  'PAYMENT_OUT',
  'TRANSFER_IN',
  'TRANSFER_OUT',
  'ADJUSTMENT_IN',
  'ADJUSTMENT_OUT',
  'PAYROLL',
  'OPERATING_EXPENSE',
  'CASH_SESSION_OPENING',
  'CASH_SESSION_CLOSING',
  'CASH_SESSION_DEPOSIT',
  'CASH_SESSION_WITHDRAWAL',
  'CASH_DEPOSIT',
  'BANK_WITHDRAWAL_TO_SHAREHOLDER',
  'PAYMENT_EXECUTION'
) NOT NULL;

-- Verificar el cambio
SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'flow_store' 
  AND TABLE_NAME = 'transactions' 
  AND COLUMN_NAME = 'transactionType';

SELECT 'PAYMENT_EXECUTION agregado exitosamente al enum transactionType' AS resultado;
