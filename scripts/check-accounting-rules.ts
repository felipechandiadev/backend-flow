import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../.env') });

async function checkAccountingRules() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306', 10),
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'flow_store',
  });

  await dataSource.initialize();

  console.log('\n=== REGLAS CONTABLES EN BASE DE DATOS ===\n');

  const rules = await dataSource.query(`
    SELECT 
      ar.id,
      ar.transactionType,
      ar.appliesTo,
      ar.priority,
      ar.isActive,
      da.code as debitAccountCode,
      da.name as debitAccountName,
      ca.code as creditAccountCode,
      ca.name as creditAccountName
    FROM accounting_rules ar
    LEFT JOIN accounts da ON ar.debitAccountId = da.id
    LEFT JOIN accounts ca ON ar.creditAccountId = ca.id
    ORDER BY ar.transactionType, ar.priority
  `);

  if (rules.length === 0) {
    console.log('⚠️  NO HAY REGLAS CONTABLES en la tabla accounting_rules\n');
    console.log('Esto significa que:');
    console.log('1. PAYROLL usa lógica hard-coded en generatePayrollEntries()');
    console.log('2. PAYMENT_EXECUTION usa lógica hard-coded en generatePaymentExecutionEntries()');
    console.log('3. Otros tipos de transacción (SALE, PURCHASE) también necesitarían reglas\n');
  } else {
    console.log(`Encontradas ${rules.length} reglas:\n`);
    
    const byType: Record<string, any[]> = {};
    rules.forEach((rule: any) => {
      if (!byType[rule.transactionType]) {
        byType[rule.transactionType] = [];
      }
      byType[rule.transactionType].push(rule);
    });

    Object.keys(byType).forEach(type => {
      console.log(`\n📋 ${type}:`);
      byType[type].forEach((rule: any) => {
        const active = rule.isActive ? '✅' : '❌';
        console.log(`   ${active} DEBE: ${rule.debitAccountCode} ${rule.debitAccountName}`);
        console.log(`      HABER: ${rule.creditAccountCode} ${rule.creditAccountName}`);
        console.log(`      Scope: ${rule.appliesTo}, Priority: ${rule.priority}`);
      });
    });
  }

  // Verificar qué transactionTypes NO tienen reglas
  console.log('\n\n=== TRANSACTION TYPES SIN REGLAS ===\n');
  
  const allTypes = [
    'SALE', 'PURCHASE', 'PURCHASE_ORDER', 'SALE_RETURN', 'PURCHASE_RETURN',
    'TRANSFER_OUT', 'TRANSFER_IN', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT',
    'PAYMENT_IN', 'PAYMENT_OUT', 'PAYMENT_EXECUTION',
    'CASH_DEPOSIT', 'OPERATING_EXPENSE',
    'CASH_SESSION_OPENING', 'CASH_SESSION_WITHDRAWAL', 'CASH_SESSION_DEPOSIT',
    'PAYROLL', 'BANK_WITHDRAWAL_TO_SHAREHOLDER'
  ];

  const typesWithRules = new Set(rules.map((r: any) => r.transactionType));
  const typesWithoutRules = allTypes.filter(t => !typesWithRules.has(t));

  if (typesWithoutRules.length > 0) {
    console.log('Los siguientes tipos NO tienen reglas en DB:');
    typesWithoutRules.forEach(type => {
      const usesHardCoded = type === 'PAYROLL' || type === 'PAYMENT_EXECUTION';
      const marker = usesHardCoded ? '🔧' : '⚠️';
      const note = usesHardCoded ? '(usa lógica hard-coded)' : '(necesita reglas)';
      console.log(`  ${marker} ${type} ${note}`);
    });
  }

  await dataSource.destroy();
}

checkAccountingRules().catch(console.error);
