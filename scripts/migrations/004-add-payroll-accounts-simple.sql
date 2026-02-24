-- =====================================================
-- PLAN SIMPLIFICADO DE CUENTAS PARA REMUNERACIONES
-- =====================================================
-- Solo crea 4 cuentas esenciales para liquidaciones
-- =====================================================

USE `flow-store`;

-- =====================================================
-- 1. CUENTA DE GASTO: Otros haberes
-- =====================================================

INSERT INTO accounting_accounts (id, code, name, type, parentId, level, isActive, debitBalance, creditBalance, currentBalance, companyId, createdAt, updatedAt)
SELECT 
    UUID() as id,
    '5.3.03' as code,
    'Otros haberes' as name,
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
ON DUPLICATE KEY UPDATE name = 'Otros haberes';

-- =====================================================
-- 2. CUENTAS DE PASIVO: Retenciones
-- =====================================================

-- AFP por pagar
INSERT INTO accounting_accounts (id, code, name, type, parentId, level, isActive, debitBalance, creditBalance, currentBalance, companyId, createdAt, updatedAt)
SELECT 
    UUID() as id,
    '2.2.02' as code,
    'AFP por pagar' as name,
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
ON DUPLICATE KEY UPDATE name = 'AFP por pagar';

-- Salud por pagar
INSERT INTO accounting_accounts (id, code, name, type, parentId, level, isActive, debitBalance, creditBalance, currentBalance, companyId, createdAt, updatedAt)
SELECT 
    UUID() as id,
    '2.2.03' as code,
    'Salud por pagar' as name,
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
ON DUPLICATE KEY UPDATE name = 'Salud por pagar';

-- Otras retenciones
INSERT INTO accounting_accounts (id, code, name, type, parentId, level, isActive, debitBalance, creditBalance, currentBalance, companyId, createdAt, updatedAt)
SELECT 
    UUID() as id,
    '2.2.04' as code,
    'Otras retenciones' as name,
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
ON DUPLICATE KEY UPDATE name = 'Otras retenciones';

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

SELECT 
    code,
    name,
    type,
    isActive
FROM accounting_accounts
WHERE code IN ('5.3.01', '5.3.02', '5.3.03', '2.2.01', '2.2.02', '2.2.03', '2.2.04')
ORDER BY code;

SELECT '✅ Cuentas de remuneraciones creadas exitosamente' as status;
