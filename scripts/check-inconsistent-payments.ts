import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno
config({ path: resolve(__dirname, '../../.env') });

async function checkInconsistentPayments() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306', 10),
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    database: process.env.DATABASE_NAME || 'flow_store',
  });

  await dataSource.initialize();

  console.log('\n=== Verificando PAYMENT_OUT inconsistentes ===\n');

  // 1. PAYMENT_OUT con status=DRAFT pero amountPaid >= total
  const inconsistentPayments = await dataSource.query(`
    SELECT 
      id,
      documentNumber,
      status,
      CAST(total AS DECIMAL(10,2)) as total,
      CAST(amountPaid AS DECIMAL(10,2)) as amountPaid,
      CAST((total - amountPaid) AS DECIMAL(10,2)) as pendingAmount,
      createdAt
    FROM transactions 
    WHERE transactionType = 'PAYMENT_OUT'
      AND status = 'DRAFT'
      AND amountPaid >= total
    ORDER BY createdAt DESC
    LIMIT 10
  `);

  console.log('1. PAYMENT_OUT con DRAFT pero sin monto pendiente:');
  if (inconsistentPayments.length === 0) {
    console.log('   ✓ No se encontraron registros inconsistentes');
  } else {
    console.log(`   ✗ Se encontraron ${inconsistentPayments.length} registros inconsistentes:`);
    inconsistentPayments.forEach((row: any) => {
      console.log(`   - ID: ${row.id}`);
      console.log(`     Doc: ${row.documentNumber}`);
      console.log(`     Status: ${row.status}`);
      console.log(`     Total: $${row.total}`);
      console.log(`     Pagado: $${row.amountPaid}`);
      console.log(`     Pendiente: $${row.pendingAmount}`);
      console.log(`     Creado: ${row.createdAt}`);
      console.log('');
    });
  }

  // 2. Todos los PAYMENT_OUT con status=DRAFT
  const allDraftPayments = await dataSource.query(`
    SELECT 
      id,
      documentNumber,
      CAST(total AS DECIMAL(10,2)) as total,
      CAST(amountPaid AS DECIMAL(10,2)) as amountPaid,
      CAST((total - amountPaid) AS DECIMAL(10,2)) as pendingAmount,
      createdAt
    FROM transactions 
    WHERE transactionType = 'PAYMENT_OUT'
      AND status = 'DRAFT'
    ORDER BY createdAt DESC
    LIMIT 20
  `);

  console.log('\n2. Todos los PAYMENT_OUT con status=DRAFT (últimos 20):');
  if (allDraftPayments.length === 0) {
    console.log('   ✓ No hay pagos pendientes');
  } else {
    console.log(`   Total: ${allDraftPayments.length}`);
    allDraftPayments.forEach((row: any) => {
      const isProblem = parseFloat(row.amountPaid) >= parseFloat(row.total);
      const marker = isProblem ? '⚠️' : '✓';
      console.log(`   ${marker} ${row.documentNumber} - Pendiente: $${row.pendingAmount} (Total: $${row.total}, Pagado: $${row.amountPaid})`);
    });
  }

  await dataSource.destroy();
}

checkInconsistentPayments().catch(console.error);
