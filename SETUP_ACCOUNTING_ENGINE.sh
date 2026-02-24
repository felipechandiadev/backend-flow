#!/bin/bash

# SETUP SCRIPT: Integración del Motor de Asientos
# Instrucciones paso a paso para que el sistema genere asientos automáticamente

echo "============================================"
echo "SETUP: Motor de Asientos Contables"
echo "============================================"

# PASO 1: Crear plan de cuentas base (si no existe)
echo ""
echo "PASO 1: Verificar plan de cuentas..."
echo "  → Debe existir recurso GET /accounting/accounts?companyId=xxx"
echo "  → Deben tener códigos únicos: 1.1.01, 1.1.02, 4.1.01, 2.2.01, etc."

# PASO 2: Registrar impuestos
echo ""
echo "PASO 2: Registrar impuestos..."
echo "  → POST /taxes {name: 'IVA 19%', percentage: 19, country: 'CL'}"
echo "  → Guardar tax.id para usar en ACCOUNTING_RULES_SEED"

# PASO 3: Reemplazar PLACEHOLDERS en seed
echo ""
echo "PASO 3: Reemplazar PLACEHOLDERS en accounting-rules.seed.ts"
echo "  Archivo: backend/src/modules/accounting-rules/domain/accounting-rules.seed.ts"
echo ""
echo "  Variables a reemplazar:"
echo "    PLACEHOLDER_COMPANY_ID → UUID de tu compañía (ej: 550e8400-e29b-41d4-a716-446655440000)"
echo "    PLACEHOLDER_IVA_TAX_ID → UUID del impuesto IVA 19% (ej: 660e8400-...)"
echo ""
echo "  Ejemplo:"
echo "    sed -i 's/PLACEHOLDER_COMPANY_ID/550e8400-e29b-41d4-a716-446655440000/g' backend/src/modules/accounting-rules/domain/accounting-rules.seed.ts"
echo "    sed -i 's/PLACEHOLDER_IVA_TAX_ID/660e8400-e29b-41d4-a716-446655440000/g' backend/src/modules/accounting-rules/domain/accounting-rules.seed.ts"

# PASO 4: Crear script de inicialización
echo ""
echo "PASO 4: Crear script migration/seeder"
echo "  Crear: backend/src/modules/accounting-rules/infrastructure/accounting-rules.seeder.ts"
echo "  El seeder debe:"
echo "    1. Leer ACCOUNTING_RULES_SEED"
echo "    2. Buscar cuentas por código (1.1.01, 1.1.02, etc.) para obtener IDs"
echo "    3. Insertar reglas en accounting_rules con los IDs correctos"

# PASO 5: Crear endpoint de inicialización
echo ""
echo "PASO 5: POST /setup/initialize-accounting-rules"
echo "  Endpoint que ejecuta el seeder"
echo "  Response: {\"rulesCreated\": 45, \"status\": \"SUCCESS\"}"

# PASO 6: Integrar con TransactionsService
echo ""
echo "PASO 6: Inyectar LedgerEntriesService en TransactionsService"
echo "  Archivo: backend/src/modules/transactions/application/transactions.service.ts"
echo ""
echo "  Pseudocódigo:"
echo "    constructor("
echo "      private transactionRepo: TransactionRepository,"
echo "      private ledgerService: LedgerEntriesService, ← AGREGAR"
echo "    ) {}"
echo ""
echo "    async createTransaction(dto: CreateTransactionDto) {"
echo "      const tx = await this.transactionRepo.save(dto);"
echo "      "
echo "      // Generar asientos automáticamente"
echo "      const ledgerResponse = await this.ledgerService.generateEntriesForTransaction("
echo "        tx,"
echo "        tx.branchId"
echo "      );"
echo "      "
echo "      // Si falla, rollback"
echo "      if (ledgerResponse.status === 'REJECTED') {"
echo "        await this.transactionRepo.remove(tx);"
echo "        throw new BadRequestException("
echo "          \`Asientos contables fallaron: \${ledgerResponse.errors[0].message}\`"
echo "        );"
echo "      }"
echo "      "
echo "      return tx;"
echo "    }"

# PASO 7: Pruebas
echo ""
echo "PASO 7: Pruebas Unitarias"
echo "  Tests a crear en: backend/src/modules/ledger-entries/__tests__/"
echo "    - LedgerEntriesService.spec.ts"
echo "    - Validaciones V1-V10"
echo "    - Generación de asientos"
echo "    - Balance check"

# PASO 8: Verificación
echo ""
echo "PASO 8: Verificar que todo funciona"
echo "  Comando: npm run test:e2e"
echo "  Escenarios:"
echo "    - Crear SALE contado → debe generar 2 asientos (caja, ingresos)"
echo "    - Crear SALE crédito → debe generar 3 asientos (cliente, ingresos, IVA)"
echo "    - Crear CASH_SESSION_OPENING sin saldo → debe rechazar (V2)"
echo "    - Crear PAYMENT_OUT sin saldo banco → debe rechazar (V1)"

echo ""
echo "============================================"
echo "PRÓXIMOS PASOS:"
echo "1. npm run start:dev"
echo "2. POST http://localhost:3000/setup/initialize-accounting-rules"
echo "3. Crear una transacción SALE"
echo "4. Verificar que se generaron asientos en ledger_entries"
echo "============================================"
