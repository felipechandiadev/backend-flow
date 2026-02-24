-- Crear cuenta 5.3.03 - Otros haberes
INSERT INTO accounting_accounts (id, code, name, type, parentId, isActive, companyId)
VALUES (
    UUID(),
    '5.3.03',
    'Otros haberes',
    'EXPENSE',
    '8102e33d-99b5-4e28-88a4-08ae80e8a986',
    1,
    'f04dd9ac-a45d-4369-a7b3-dae7635b15de'
);

-- Crear cuenta 2.2.02 - AFP por pagar
INSERT INTO accounting_accounts (id, code, name, type, parentId, isActive, companyId)
VALUES (
    UUID(),
    '2.2.02',
    'AFP por pagar',
    'LIABILITY',
    'c096727d-e531-464a-b25b-db9a8190b1c2',
    1,
    'f04dd9ac-a45d-4369-a7b3-dae7635b15de'
);

-- Crear cuenta 2.2.03 - Salud por pagar
INSERT INTO accounting_accounts (id, code, name, type, parentId, isActive, companyId)
VALUES (
    UUID(),
    '2.2.03',
    'Salud por pagar',
    'LIABILITY',
    'c096727d-e531-464a-b25b-db9a8190b1c2',
    1,
    'f04dd9ac-a45d-4369-a7b3-dae7635b15de'
);

-- Crear cuenta 2.2.04 - Otras retenciones
INSERT INTO accounting_accounts (id, code, name, type, parentId, isActive, companyId)
VALUES (
    UUID(),
    '2.2.04',
    'Otras retenciones',
    'LIABILITY',
    'c096727d-e531-464a-b25b-db9a8190b1c2',
    1,
    'f04dd9ac-a45d-4369-a7b3-dae7635b15de'
);
