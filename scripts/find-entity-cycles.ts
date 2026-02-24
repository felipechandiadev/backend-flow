import fs from 'fs';
import path from 'path';

const dir = path.resolve(__dirname, '..', 'data', 'entities');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

const graph: Record<string, string[]> = {};

for (const file of files) {
  const full = path.join(dir, file);
  const content = fs.readFileSync(full, 'utf8');
  const imports = Array.from(content.matchAll(/import\s+(?!type)(?:\{[^}]+\}|[^\s]+)\s+from\s+['\"](\.\/[^'\"]+)['\"]/g));
  const deps = imports.map(m => {
    const rel = m[1];
    const target = path.resolve(dir, rel + (rel.endsWith('.ts') ? '' : '.ts'));
    return path.basename(target);
  }).filter(Boolean);
  graph[file] = deps;
}

// detect cycles using DFS
const cycles: string[][] = [];
const visited = new Set<string>();
const stack: string[] = [];

function dfs(node: string, seen: Set<string>) {
  if (seen.has(node)) {
    const idx = stack.indexOf(node);
    cycles.push(stack.slice(idx).concat(node));
    return;
  }
  if (visited.has(node)) return;
  visited.add(node);
  seen.add(node);
  stack.push(node);
  for (const neigh of graph[node] || []) {
    if (graph[neigh]) dfs(neigh, seen);
  }
  stack.pop();
  seen.delete(node);
}

for (const f of Object.keys(graph)) {
  dfs(f, new Set());
}

console.log('Found cycles:', cycles.length);
for (const c of cycles) console.log(' -', c.join(' -> '));
