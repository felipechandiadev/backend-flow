import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno
config({ path: resolve(__dirname, '../../.env') });

/**
 * Script de prueba para verificar el flujo completo de PAYMENT_EXECUTION
 * 
 * Flujo:
 * 1. Buscar PAYMENT_OUT recientes (creados por PayrollAccountsPayableListener)
 * 2. Mostrar información de cada PAYMENT_OUT
 * 3. Verificar si ya tienen PAYMENT_EXECUTION asociado
 * 4. Mostrar asientos contables generados (si existen)
 * 
 * USO:
 * npx tsx scripts/test-payment-execution.ts
 */
async function testPaymentExecution() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306', 10),
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'flow_store',
  });

  await dataSource.initialize();
  console.log('\n=== VERIFICACIÓN DE PAYMENT_EXECUTION ===\n');

  // 1. Buscar PAYMENT_OUT recientes
  const paymentOuts = await dataSource.query(`
    SELECT 
      t.id,
      t.documentNumber,
      t.status,
      CAST(t.total AS DECIMAL(10,2)) as total,
      CAST(t.amountPaid AS DECIMAL(10,2)) as amountPaid,
      t.paymentMethod,
      t.metadata,
      t.createdAt
    FROM transactions t
    WHERE t.transactionType = 'PAYMENT_OUT'
      AND t.metadata->'$.origin' = 'PAYROLL'
    ORDER BY t.createdAt DESC
    LIMIT 10
  `);

  console.log(`📋 Encontrados ${paymentOuts.length} pagos de nómina (PAYMENT_OUT):\n`);

  for (const payment of paymentOuts) {
    const metadata = typeof payment.metadata === 'string' 
      ? JSON.parse(payment.metadata) 
      : payment.metadata;

    const paymentType = metadata.payrollLineType || 'UNKNOWN';
    const isPending = payment.status === 'DRAFT';
    const statusIcon = isPending ? '⏳' : '✅';

    console.log(`${statusIcon} ${payment.documentNumber}`);
    console.log(`   Tipo: ${paymentType}`);
    console.log(`   Total: $${payment.total}`);
    console.log(`   Pagado: $${payment.amountPaid}`);
    console.log(`   Estado: ${payment.status}`);

    // 2. Buscar PAYMENT_EXECUTION relacionado
    const executions = await dataSource.query(`
      SELECT 
        t.id,
        t.documentNumber,
        t.status,
        CAST(t.total AS DECIMAL(10,2)) as total,
        t.createdAt
      FROM transactions t
      WHERE t.transactionType = 'PAYMENT_EXECUTION'
        AND t.relatedTransactionId = ?
      ORDER BY t.createdAt DESC
    `, [payment.id]);

    if (executions.length > 0) {
      console.log(`   💵 Ejecución de pago: ${executions[0].documentNumber}`);
      
      // 3. Buscar asientos contables generados
      const ledgerEntries = await dataSource.query(`
        SELECT 
          le.id,
          a.code as accountCode,
          a.name as accountName,
          CAST(le.debit AS DECIMAL(10,2)) as debit,
          CAST(le.credit AS DECIMAL(10,2)) as credit,
          le.description
        FROM ledger_entries le
        JOIN accounts a ON le.accountId = a.id
        WHERE le.transactionId = ?
        ORDER BY le.debit DESC, le.credit DESC
      `, [executions[0].id]);

      if (ledgerEntries.length > 0) {
        console.log(`   📊 Asientos contables generados:`);
        const totalDebit = ledgerEntries.reduce((sum: number, e: any) => sum + parseFloat(e.debit), 0);
        const totalCredit = ledgerEntries.reduce((sum: number, e: any) => sum + parseFloat(e.credit), 0);
        
        ledgerEntries.forEach((entry: any) => {
          if (parseFloat(entry.debit) > 0) {
            console.log(`      DEBE  ${entry.accountCode} ${entry.accountName}: $${entry.debit}`);
          } else {
            console.log(`      HABER ${entry.accountCode} ${entry.accountName}: $${entry.credit}`);
          }
        });
        
        const balanced = Math.abs(totalDebit - totalCredit) < 0.01;
        console.log(`      Balance: ${balanced ? '✅' : '❌'} DEBE=$${totalDebit.toFixed(2)} HABER=$${totalCredit.toFixed(2)}`);
      } else {
        console.log(`   ⚠️  Sin asientos contables (revisar AccountingEngineListener)`);
      }
    } else {
      console.log(`   ⏸️  Pago pendiente (sin ejecución)`);
    }

    console.log('');
  }

  // 4. Resumen general
  console.log('\n=== RESUMEN ===\n');

  const summary = await dataSource.query(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN t.status = 'DRAFT' THEN 1 ELSE 0 END) as pendientes,
      SUM(CASE WHEN t.status = 'CONFIRMED' THEN 1 ELSE 0 END) as confirmados,
      CAST(SUM(t.total) AS DECIMAL(10,2)) as montoTotal,
      CAST(SUM(t.amountPaid) AS DECIMAL(10,2)) as montoPagado
    FROM transactions t
    WHERE t.transactionType = 'PAYMENT_OUT'
      AND t.metadata->'$.origin' = 'PAYROLL'
  `);

  const stats = summary[0];
  console.log(`Total PAYMENT_OUT de nómina: ${stats.total}`);
  console.log(`  - Pendientes: ${stats.pendientes}`);
  console.log(`  - Confirmados: ${stats.confirmados}`);
  console.log(`  - Monto total: $${stats.montoTotal}`);
  console.log(`  - Monto pagado: $${stats.montoPagado}`);

  const executionCount = await dataSource.query(`
    SELECT COUNT(*) as total
    FROM transactions
    WHERE transactionType = 'PAYMENT_EXECUTION'
  `);

  console.log(`\nTotal PAYMENT_EXECUTION creados: ${executionCount[0].total}`);

  const ledgerCount = await dataSource.query(`
    SELECT COUNT(*) as total
    FROM ledger_entries le
    JOIN transactions t ON le.transactionId = t.id
    WHERE t.transactionType = 'PAYMENT_EXECUTION'
  `);

  console.log(`Total asientos de PAYMENT_EXECUTION: ${ledgerCount[0].total}`);

  console.log('\n=== PRUEBA COMPLETA ===\n');
  console.log('Para probar el flujo completo:');
  console.log('1. Desde el frontend, ir a "Cuentas por pagar"');
  console.log('2. Hacer clic en "Pagar" en cualquier registro DRAFT');
  console.log('3. Completar el formulario de pago');
  console.log('4. Verificar que:');
  console.log('   - PAYMENT_OUT cambia a status=CONFIRMED');
  console.log('   - Se crea nueva transacción PAYMENT_EXECUTION');
  console.log('   - Se generan asientos contables automáticamente');
  console.log('   - DEBE: Cuenta por pagar (2.2.01, 2.2.02, etc.)');
  console.log('   - HABER: Banco (1.1.02) o Caja (1.1.01)');
  console.log('');

  await dataSource.destroy();
}

testPaymentExecution().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
