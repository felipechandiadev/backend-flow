import 'reflect-metadata';
import '../data/entities';
import { getMetadataArgsStorage } from 'typeorm';

const relations = getMetadataArgsStorage().relations as any[];

const byTarget = new Map<string, any[]>();
for (const r of relations) {
  const targetName = r.target?.name || r.target;
  if (!byTarget.has(targetName)) byTarget.set(targetName, []);
  byTarget.get(targetName)!.push(r);
}

function resolveType(type: any) {
  if (typeof type === 'function') {
    try { const ret = type(); return ret?.name || ret; } catch (e) { return 'function()'; }
  }
  return type;
}

let errors: string[] = [];
for (const r of relations) {
  const source = r.target?.name || r.target;
  const prop = r.propertyName;
  const resolved = resolveType(r.type);
  const inverse = r.inverseSideProperty || r.inverseSide || (r.options && r.options.inverseSide) || null;

  // Many decorators use a function for inverse side: (x) => x.transaction
  let inverseName: string | null = null;
  if (typeof inverse === 'function') {
    const s = inverse.toString();
    const m = s.match(/\.(\w+)/);
    inverseName = m ? m[1] : null;
  } else if (typeof inverse === 'string') {
    inverseName = inverse;
  } else if (r.inverseRelation) {
    inverseName = r.inverseRelation.propertyName;
  }

  // If inverseName is provided, check that target has that relation
  if (inverseName && typeof resolved === 'string') {
    const targetRels = byTarget.get(resolved);
    if (!targetRels) {
      errors.push(`${source}.${prop} -> expected target ${resolved} to have relations but none found`);
      continue;
    }
    const found = targetRels.find(tr => tr.propertyName === inverseName);
    if (!found) {
      errors.push(`${source}.${prop} -> inverse ${resolved}.${inverseName} NOT FOUND`);
    }
  }
}

if (errors.length === 0) {
  console.log('All inverse relations look OK');
} else {
  console.log('Relation issues found:\n' + errors.join('\n'));
}
