(async () => {
  try {
    const { getDb } = require('../data/db');
    const { postTransactionToLedger } = require('../data/services/AccountingEngine');

    const doc = process.argv[2];
    if (!doc) {
      console.error('Uso: ts-node scripts/repost-transaction.ts <DOCUMENT_NUMBER>');
      process.exit(1);
    }

    const ds = await getDb();
    const txRepo = ds.getRepository('Transaction');
    const ledgerRepo = ds.getRepository('LedgerEntry');

    const tx = await txRepo.findOne({ where: { documentNumber: doc } });
    if (!tx) {
      console.error('Transacción no encontrada con documentNumber=', doc);
      process.exit(2);
    }

    console.log('Re-posteando transaction:', tx.id, tx.documentNumber, tx.transactionType, 'subtotal=', tx.subtotal, 'tax=', tx.taxAmount, 'total=', tx.total);

    const res = await postTransactionToLedger(ds.manager, tx.id);
    console.log('Resultado postTransactionToLedger:', res);

    const entries = await ledgerRepo.find({ where: { transactionId: tx.id }, relations: ['account'], order: { id: 'ASC' } });
    console.log('Ledger entries for transaction:');
    for (const e of entries) {
      console.log(`${e.entryDate} | ${e.account?.code ?? e.accountId} | ${e.description} | debit=${e.debit} credit=${e.credit}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error in script:', err);
    process.exit(3);
  }
})();
