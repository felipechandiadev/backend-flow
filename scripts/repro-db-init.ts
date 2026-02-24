import { getDb } from '../data/db';

(async function main() {
  try {
    console.log('[repro-db-init] Inicializando DB...');
    const db = await getDb();
    console.log('[repro-db-init] DataSource initialized:', !!db?.isInitialized);

    // Intentionally request repository by string to reproduce / validate shim
    try {
      const txRepo = db.getRepository('Transaction');
      console.log('[repro-db-init] Obtained repository for Transaction, metadata name:', txRepo.metadata?.name || 'n/a');
    } catch (err) {
      console.error('[repro-db-init] getRepository("Transaction") failed:', err);
    }

    // Also test repository by constructor
    try {
      // dynamic import to avoid circular issues
      const { Transaction } = await import('../data/entities/Transaction');
      const txRepoCtor = db.getRepository(Transaction as any);
      console.log('[repro-db-init] Obtained repository by constructor, metadata name:', txRepoCtor.metadata?.name || 'n/a');
    } catch (err) {
      console.error('[repro-db-init] getRepository(Transaction) failed:', err);
    }

    await db.destroy();
    console.log('[repro-db-init] Done.');
  } catch (error) {
    console.error('[repro-db-init] Error initializing DB:', error);
    process.exit(1);
  }
})();