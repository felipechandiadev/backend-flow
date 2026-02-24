import { getDb } from '../data/db';

(async () => {
  try {
    const ds = await getDb();
    console.log('DataSource initialized:', !!ds && (ds as any).isInitialized);
    console.log('Registered entity count:', (ds as any).entityMetadatas.length);
    const entities = (ds as any).entityMetadatas.map((m: any) => ({
      name: m.name,
      targetName: m.target && m.target.name ? m.target.name : String(m.target),
      tableName: m.tableName,
    }));
    console.log('Entities:', entities);
  } catch (err) {
    console.error('Diagnostic error:', err && (err as any).stack ? (err as any).stack : err);
    process.exit(1);
  }
})();
