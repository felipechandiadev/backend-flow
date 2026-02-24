-- =====================================================
-- AGREGAR CUENTAS CONTABLES PARA REMUNERACIONES
-- =====================================================
-- Este script crea las cuentas necesarias para registrar
-- correctamente las liquidaciones de sueldos
-- 
-- Fecha: 21 de febrero de 2026
-- =====================================================

USE `flow-store`;

-- =====================================================
-- 1. CUENTAS DE GASTO (5.3.xx - Personal)
-- =====================================================

-- Subcuentas de Sueldos (desgloses de 5.3.01)
INSERT INTO accounting_accounts (id, code, name, type, parentId, level, isActive, debitBalance, creditBalance, currentBalance, companyId, createdAt, updatedAt)
SELECT 
    UUID() as id,
    '5.3.03' as code,
    'Horas Extras' as name,
    'EXPENSE' as type,
    (SELECT id FROM accounting_accounts WHERE code = '5.3.01' LIMIT 1) as parentId,
    3 as level,
    1 as isActive,
    0 as debitBalance,
    0 as creditBalance,
    0 as currentBalance,
    companyId,
    NOW() as createdAt,
    NOW() as updatedAt
FROM accounting_accounts 
WHERE code = '5.3.01'
LIMIT 1
ON DUPLICATE KEY UPDATE name = name; -- No hacer nada si ya existe

INSERT INTO accounting_accounts (id, code, name, type, parentId, level, isActive, debitBalance, creditBalance, currentBalance, companyId, createdAt, updatedAt)
SELECT 
    UUID() as id,
    '5.3.04' as code,
    'Bonos y Comisiones' as name,
    'EXPENSE' as type,
    (SELECT id FROM accounting_accounts WHERE code = '5.3.01' LIMIT 1) as parentId,
    3 as level,
    1 as isActive,
    0 as debitBalance,
    0 as creditBalance,
    0 as currentBalance,
    companyId,
    NOW() as createdAt,
    NOW() as updatedAt
FROM accounting_accounts 
WHERE code = '5.3.01'
LIMIT 1
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO accounting_accounts (id, code, name, type, parentId, level, isActive, debitBalance, creditBalance, currentBalance, companyId, createdAt, updatedAt)
SELECT 
    UUID() as id,
    '5.3.05' as code,
    'Gratificaciones' as name,
    'EXPENSE' as type,
    (SELECT id FROM accounting_accounts WHERE code = '5.3.01' LIMIT 1) as parentId,
    3 as level,
    1 as isActive,
    0 as debitBalance,
    0 as creditBalance,
    0 as currentBalance,
    companyId,
    NOW() as createdAt,
    NOW() as updatedAt
FROM accounting_accounts 
WHERE code = '5.3.01'
LIMIT 1
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO accounting_accounts (id, code, name, type, parentId, level, isActive, debitBalance, creditBalance, currentBalance, companyId, createdAt, updatedAt)
SELECT 
    UUID() as id,
    '5.3.06' as code,
    'Aguinaldos' as name,
    'EXPENSE' as type,
    (SELECT id FROM accounting_accounts WHERE code = '5.3.01' LIMIT 1) as parentId,
    3 as level,
    1 as isActive,
    0 as debitBalance,
    0 as creditBalance,
    0 as currentBalance,
    companyId,
    NOW() as createdAt,
    NOW() as updatedAt
FROM accounting_accounts 
WHERE code = '5.3.01'
LIMIT 1
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO accounting_accounts (id, code, name, type, parentId, level, isActive, debitBalance, creditBalance, currentBalance, companyId, createdAt, updatedAt)
SELECT 
    UUID() as id,
    '5.3.07' as code,
    'Asignaciones' as name,
    'EXPENSE' as type,
    (SELECT id FROM accounting_accounts WHERE code = '5.3.01' LIMIT 1) as parentId,
    3 as level,
    1 as isActive,
    0 as debitBalance,
    0 as creditBalance,
    0 as currentBalance,
    companyId,
    NOW() as createdAt,
    NOW() as updatedAt
FROM accounting_accounts 
WHERE code = '5.3.01'
LIMIT 1
ON DUPLICATE KEY UPDATE name = name;

-- =====================================================
-- 2. CUENTAS DE PASIVO (2.2.xx - Remuneraciones)
-- =====================================================

-- Subcuentas de Remuneraciones por Pagar
INSERT INTO accounting_accounts (id, code, name, type, parentId, level, isActive, debitBalance, creditBalance, currentBalance, companyId, createdAt, updatedAt)
SELECT 
    UUID() as id,
    '2.2.02' as code,
    'AFP por Pagar (Retenciones)' as name,
    'LIABILITY' as type,
    (SELECT id FROM accounting_accounts WHERE code = '2.2.01' LIMIT 1) as parentId,
    3 as level,
    1 as isActive,
    0 as debitBalance,
    0 as creditBalance,
    0 as currentBalance,
    companyId,
    NOW() as createdAt,
    NOW() as updatedAt
FROM accounting_accounts 
WHERE code = '2.2.01'
LIMIT 1
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO accounting_accounts (id, code, name, type, parentId, level, isActive, debitBalance, creditBalance, currentBalance, companyId, createdAt, updatedAt)
SELECT 
    UUID() as id,
    '2.2.03' as code,
    'Salud por Pagar (Retenciones)' as name,
    'LIABILITY' as type,
    (SELECT id FROM accounting_accounts WHERE code = '2.2.01' LIMIT 1) as parentId,
    3 as level,
    1 as isActive,
    0 as debitBalance,
    0 as creditBalance,
    0 as currentBalance,
    companyId,
    NOW() as createdAt,
    NOW() as updatedAt
FROM accounting_accounts 
WHERE code = '2.2.01'
LIMIT 1
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO accounting_accounts (id, code, name, type, parentId, level, isActive, debitBalance, creditBalance, currentBalance, companyId, createdAt, updatedAt)
SELECT 
    UUID() as id,
    '2.2.04' as code,
    'Impuesto Único por Pagar' as name,
    'LIABILITY' as type,
    (SELECT id FROM accounting_accounts WHERE code = '2.2.01' LIMIT 1) as parentId,
    3 as level,
    1 as isActive,
    0 as debitBalance,
    0 as creditBalance,
    0 as currentBalance,
    companyId,
    NOW() as createdAt,
    NOW() as updatedAt
FROM accounting_accounts 
WHERE code = '2.2.01'
LIMIT 1
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO accounting_accounts (id, code, name, type, parentId, level, isActive, debitBalance, creditBalance, currentBalance, companyId, createdAt, updatedAt)
SELECT 
    UUID() as id,
    '2.2.05' as code,
    'Préstamos Empleados por Descontar' as name,
    'LIABILITY' as type,
    (SELECT id FROM accounting_accounts WHERE code = '2.2.01' LIMIT 1) as parentId,
    3 as level,
    1 as isActive,
    0 as debitBalance,
    0 as creditBalance,
    0 as currentBalance,
    companyId,
    NOW() as createdAt,
    NOW() as updatedAt
FROM accounting_accounts 
WHERE code = '2.2.01'
LIMIT 1
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO accounting_accounts (id, code, name, type, parentId, level, isActive, debitBalance, creditBalance, currentBalance, companyId, createdAt, updatedAt)
SELECT 
    UUID() as id,
    '2.2.06' as code,
    'Aprinsa por Pagar' as name,
    'LIABILITY' as type,
    (SELECT id FROM accounting_accounts WHERE code = '2.2.01' LIMIT 1) as parentId,
    3 as level,
    1 as isActive,
    0 as debitBalance,
    0 as creditBalance,
    0 as currentBalance,
    companyId,
    NOW() as createdAt,
    NOW() as updatedAt
FROM accounting_accounts 
WHERE code = '2.2.01'
LIMIT 1
ON DUPLICATE KEY UPDATE name = name;

-- =====================================================
-- 3. CUENTAS DE PASIVO (2.3.xx - Obligaciones Laborales)
-- =====================================================

-- Primero crear la cuenta padre 2.3 si no existe
INSERT INTO accounting_accounts (id, code, name, type, parentId, level, isActive, debitBalance, creditBalance, currentBalance, companyId, createdAt, updatedAt)
SELECT 
    UUID() as id,
    '2.3' as code,
    'Obligaciones Laborales' as name,
    'LIABILITY' as type,
    (SELECT id FROM accounting_accounts WHERE code = '2' LIMIT 1) as parentId,
    2 as level,
    1 as isActive,
    0 as debitBalance,
    0 as creditBalance,
    0 as currentBalance,
    companyId,
    NOW() as createdAt,
    NOW() as updatedAt
FROM accounting_accounts 
WHERE code = '2'
LIMIT 1
ON DUPLICATE KEY UPDATE name = name;

-- Ahora las subcuentas de obligaciones laborales (aportes patronales)
INSERT INTO accounting_accounts (id, code, name, type, parentId, level, isActive, debitBalance, creditBalance, currentBalance, companyId, createdAt, updatedAt)
SELECT 
    UUID() as id,
    '2.3.01' as code,
    'AFP por Pagar (Aporte Patronal)' as name,
    'LIABILITY' as type,
    (SELECT id FROM accounting_accounts WHERE code = '2.3' LIMIT 1) as parentId,
    3 as level,
    1 as isActive,
    0 as debitBalance,
    0 as creditBalance,
    0 as currentBalance,
    companyId,
    NOW() as createdAt,
    NOW() as updatedAt
FROM accounting_accounts 
WHERE code = '2.3'
LIMIT 1
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO accounting_accounts (id, code, name, type, parentId, level, isActive, debitBalance, creditBalance, currentBalance, companyId, createdAt, updatedAt)
SELECT 
    UUID() as id,
    '2.3.02' as code,
    'Mutual de Seguridad por Pagar' as name,
    'LIABILITY' as type,
    (SELECT id FROM accounting_accounts WHERE code = '2.3' LIMIT 1) as parentId,
    3 as level,
    1 as isActive,
    0 as debitBalance,
    0 as creditBalance,
    0 as currentBalance,
    companyId,
    NOW() as createdAt,
    NOW() as updatedAt
FROM accounting_accounts 
WHERE code = '2.3'
LIMIT 1
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO accounting_accounts (id, code, name, type, parentId, level, isActive, debitBalance, creditBalance, currentBalance, companyId, createdAt, updatedAt)
SELECT 
    UUID() as id,
    '2.3.03' as code,
    'Seguro Cesantía por Pagar' as name,
    'LIABILITY' as type,
    (SELECT id FROM accounting_accounts WHERE code = '2.3' LIMIT 1) as parentId,
    3 as level,
    1 as isActive,
    0 as debitBalance,
    0 as creditBalance,
    0 as currentBalance,
    companyId,
    NOW() as createdAt,
    NOW() as updatedAt
FROM accounting_accounts 
WHERE code = '2.3'
LIMIT 1
ON DUPLICATE KEY UPDATE name = name;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Mostrar las cuentas creadas
SELECT 
    code,
    name,
    type,
    CASE 
        WHEN level = 2 THEN '  '
        WHEN level = 3 THEN '    '
        ELSE ''
    END as indent
FROM accounting_accounts
WHERE code LIKE '5.3%' OR code LIKE '2.2%' OR code LIKE '2.3%'
ORDER BY code;

-- Contar cuántas cuentas de remuneraciones hay ahora
SELECT 
    'Cuentas de Gasto (5.3.xx)' as categoria,
    COUNT(*) as cantidad
FROM accounting_accounts
WHERE code LIKE '5.3%'
UNION ALL
SELECT 
    'Cuentas de Pasivo (2.2.xx)' as categoria,
    COUNT(*) as cantidad
FROM accounting_accounts
WHERE code LIKE '2.2%'
UNION ALL
SELECT 
    'Cuentas de Pasivo (2.3.xx)' as categoria,
    COUNT(*) as cantidad
FROM accounting_accounts
WHERE code LIKE '2.3%';
