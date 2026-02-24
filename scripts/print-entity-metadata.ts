import 'reflect-metadata';
import '../data/entities';
import { getMetadataArgsStorage } from 'typeorm';

const tables = getMetadataArgsStorage().tables.map((t: any) => ({ targetName: t.target?.name, tableName: t.name }));
console.log('Tables:', tables);

const relations = getMetadataArgsStorage().relations.filter((r: any) => r.target?.name === 'Transaction');
console.log('\nTransaction relations:');
relations.forEach((r: any) => {
  console.log({ propertyName: r.propertyName, type: typeof r.type === 'function' ? (r.type as any).name || 'function' : r.type });
});

const txLineRelation = getMetadataArgsStorage().relations.find((r: any) => r.target?.name === 'TransactionLine');
console.log('\nSample TransactionLine relation:', txLineRelation ? { propertyName: txLineRelation.propertyName, type: typeof txLineRelation.type === 'function' ? (txLineRelation.type as any).name || 'function' : txLineRelation.type } : null);

const linesRel = relations.find((r: any) => r.propertyName === 'lines');
console.log('\nlines relation type.toString():', linesRel?.type?.toString());
if (linesRel && typeof linesRel.type === 'function') {
  try {
    const ret = (linesRel.type as any)();
    console.log('lines relation type() return value name:', ret && ret.name);
  } catch (err: any) {
    console.log('calling linesRel.type() threw:', err?.message ?? err);
  }
} else {
  console.log('linesRel.type is not callable; type:', typeof linesRel?.type, linesRel?.type);
}


