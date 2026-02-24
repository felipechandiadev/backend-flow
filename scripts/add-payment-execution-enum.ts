import { config } from 'dotenv';
import { resolve } from 'path';
import { createConnection } from 'mysql2/promise';

// Cargar variables de entorno
config({ path: resolve(__dirname, '../.env') });

async function addPaymentExecutionEnum() {
  const connection = await createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'flow_store',
  });

  try {
    console.log('📝 Verificando enum actual...');
    
    const [columns]: any = await connection.query(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = '${process.env.DB_DATABASE || 'flow_store'}' 
        AND TABLE_NAME = 'transactions' 
        AND COLUMN_NAME = 'transactionType'
    `);
    
    console.log('Enum actual:', columns[0]?.COLUMN_TYPE);

    console.log('\n🔧 Agregando PAYMENT_EXECUTION al enum...');
    
    await connection.query(`
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
      ) NOT NULL
    `);

    console.log('✅ PAYMENT_EXECUTION agregado exitosamente');

    const [updatedColumns]: any = await connection.query(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = '${process.env.DB_DATABASE || 'flow_store'}' 
        AND TABLE_NAME = 'transactions' 
        AND COLUMN_NAME = 'transactionType'
    `);
    
    console.log('Enum actualizado:', updatedColumns[0]?.COLUMN_TYPE);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

addPaymentExecutionEnum()
  .then(() => {
    console.log('\n✅ Migración completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migración fallida:', error);
    process.exit(1);
  });
