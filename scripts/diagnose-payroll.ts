import { DataSource } from 'typeorm';

async function diagnose() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'flow_user',
    password: process.env.DB_PASSWORD || 'flow_password',
    database: process.env.DB_DATABASE || 'flow_store',
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connected\n');

    // 1. Verificar transacciones PAYROLL
    console.log('📋 Checking PAYROLL transactions...');
    const payrollTxs = await dataSource.query(`
      SELECT id, transactionType, documentNumber, total, metadata, createdAt 
      FROM transactions 
      WHERE transactionType = 'PAYROLL' 
      ORDER BY createdAt DESC 
      LIMIT 3
    `);

    if (payrollTxs.length === 0) {
      console.log('❌ No PAYROLL transactions found in database');
    } else {
      console.log(`✅ Found ${payrollTxs.length} PAYROLL transaction(s):`);
      payrollTxs.forEach((tx: any) => {
        console.log(`  - ${tx.documentNumber} (${tx.id}) - Total: $${tx.total} - ${tx.createdAt}`);
        if (tx.metadata) {
          try {
            const meta = typeof tx.metadata === 'string' ? JSON.parse(tx.metadata) : tx.metadata;
            console.log(`    Lines: ${meta.lines?.length || 0}, TotalEarnings: ${meta.totalEarnings || 0}`);
          } catch (e) {
            console.log(`    Metadata: ${JSON.stringify(tx.metadata).substring(0, 100)}...`);
          }
        }
      });
    }
    console.log('');

    // 2. Verificar ledger_entries para PAYROLL
    console.log('📒 Checking ledger_entries for PAYROLL...');
    const ledgerEntries = await dataSource.query(`
      SELECT le.id, le.description, le.debit, le.credit, le.transactionId, t.documentNumber
      FROM ledger_entries le
      JOIN transactions t ON le.transactionId = t.id
      WHERE t.transactionType = 'PAYROLL'
      ORDER BY le.entryDate DESC
      LIMIT 10
    `);

    if (ledgerEntries.length === 0) {
      console.log('❌ No ledger entries found for PAYROLL transactions');
      console.log('   🔍 This means the accounting engine is NOT creating entries');
    } else {
      console.log(`✅ Found ${ledgerEntries.length} ledger entries:`);
      ledgerEntries.forEach((entry: any) => {
        console.log(`  - ${entry.description} | DEBE: ${entry.debit} | HABER: ${entry.credit}`);
      });
    }
    console.log('');

    // 3. Verificar si existen las cuentas contables necesarias
    console.log('💰 Checking accounting accounts...');
    const accounts = await dataSource.query(`
      SELECT code, name 
      FROM accounting_accounts 
      WHERE code IN ('5.3.01', '5.3.03', '2.2.01', '2.2.02', '2.2.03', '2.2.04')
      ORDER BY code
    `);

    console.log(`Found ${accounts.length}/7 required accounts:`);
    accounts.forEach((acc: any) => {
      console.log(`  ✓ ${acc.code} - ${acc.name}`);
    });

    const missing = ['5.3.01', '5.3.03', '2.2.01', '2.2.02', '2.2.03', '2.2.04'].filter(
      code => !accounts.find((a: any) => a.code === code)
    );
    if (missing.length > 0) {
      console.log(`  ❌ Missing accounts: ${missing.join(', ')}`);
    }
    console.log('');

    // 4. Verificar tabla ledger_entries existe
    console.log('🗄️  Checking database tables...');
    const tables = await dataSource.query(`SHOW TABLES LIKE 'ledger_entries'`);
    if (tables.length === 0) {
      console.log('❌ Table ledger_entries does NOT exist!');
      console.log('   Run migrations or create the table manually');
    } else {
      console.log('✅ Table ledger_entries exists');
      const structure = await dataSource.query(`DESCRIBE ledger_entries`);
      console.log(`   Columns: ${structure.map((s: any) => s.Field).join(', ')}`);
    }
    console.log('');

    // 5. Diagnóstico final
    console.log('📊 DIAGNOSIS SUMMARY:');
    console.log('='.repeat(50));
    
    if (payrollTxs.length === 0) {
      console.log('❌ ISSUE: No PAYROLL transactions created yet');
      console.log('   ACTION: Create a remuneration through the frontend');
    } else if (ledgerEntries.length === 0) {
      console.log('❌ ISSUE: Transactions exist but NO ledger entries');
      console.log('   CAUSES:');
      console.log('   1. AccountingEngineListener is NOT running');
      console.log('   2. EventEmitter is NOT emitting events');
      console.log('   3. LedgerEntriesService.generatePayrollEntries() is failing');
      console.log('   4. Table ledger_entries does not exist');
      console.log('');
      console.log('   ACTIONS:');
      console.log('   1. Restart backend server (npm run start:dev)');
      console.log('   2. Check backend logs for errors');
      console.log('   3. Verify EventsModule is imported in AppModule');
      console.log('   4. Run migrations to create ledger_entries table');
    } else if (accounts.length < 6) {
      console.log('⚠️  WARNING: Some accounting accounts are missing');
      console.log('   ACTION: Run seed or SQL script to create accounts');
    } else {
      console.log('✅ ALL SYSTEMS OPERATIONAL');
      console.log('   Transactions: ✓');
      console.log('   Ledger Entries: ✓');
      console.log('   Accounting Accounts: ✓');
    }

  } catch (error) {
    console.error('❌ Error during diagnosis:', error);
  } finally {
    await dataSource.destroy();
  }
}

diagnose();
