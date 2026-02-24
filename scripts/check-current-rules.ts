import { createConnection } from 'mysql2/promise';

async function checkCurrentRules() {
  const connection = await createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'redbull90',
    database: 'flow-store',
  });

  try {
    console.log('📊 Contando reglas contables en la base de datos...\n');
    
    const [countResult]: any = await connection.query(
      'SELECT COUNT(*) as total FROM accounting_rules'
    );
    
    console.log(`Total de reglas en BD: ${countResult[0].total}`);
    console.log(`Total de reglas en seed (JSON): 15\n`);
    
    if (countResult[0].total > 15) {
      console.log('⚠️  Tienes más reglas en BD que en el seed.');
      console.log('    Si ejecutas el seed, perderás las reglas extras.\n');
    } else if (countResult[0].total === 15) {
      console.log('✅ Tienes exactamente las reglas del seed.');
      console.log('   No perderás nada al ejecutar el seed.\n');
    } else {
      console.log('⚠️  Tienes menos reglas en BD que en el seed.');
      console.log('   El seed agregará las faltantes.\n');
    }

    console.log('📋 Reglas actuales por tipo de transacción:\n');
    
    const [rules]: any = await connection.query(`
      SELECT 
        transactionType,
        paymentMethod,
        COUNT(*) as cantidad
      FROM accounting_rules
      GROUP BY transactionType, paymentMethod
      ORDER BY transactionType, paymentMethod
    `);
    
    for (const rule of rules) {
      const method = rule.paymentMethod ? ` (${rule.paymentMethod})` : '';
      console.log(`  ${rule.transactionType}${method}: ${rule.cantidad} regla(s)`);
    }

    console.log('\n📝 Reglas detalladas:\n');
    
    const [detailedRules]: any = await connection.query(`
      SELECT 
        ar.id,
        ar.transactionType,
        ar.paymentMethod,
        ar.appliesTo,
        ar.priority,
        debit.code as debitCode,
        debit.name as debitName,
        credit.code as creditCode,
        credit.name as creditName
      FROM accounting_rules ar
      JOIN accounting_accounts debit ON ar.debitAccountId = debit.id
      JOIN accounting_accounts credit ON ar.creditAccountId = credit.id
      ORDER BY ar.transactionType, ar.priority
    `);
    
    for (const rule of detailedRules) {
      const method = rule.paymentMethod ? ` [${rule.paymentMethod}]` : '';
      console.log(`  ${rule.transactionType}${method}`);
      console.log(`    Debe: ${rule.debitCode} ${rule.debitName}`);
      console.log(`    Haber: ${rule.creditCode} ${rule.creditName}`);
      console.log(`    Scope: ${rule.appliesTo}, Priority: ${rule.priority}`);
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

checkCurrentRules()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
