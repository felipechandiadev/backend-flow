import * as fs from 'fs';
import * as path from 'path';

const folders = ['next', 'docs', 'data'];
const extensions = ['.ts', '.tsx', '.md'];

const replacements = [
    { from: /Centro de costos/g, to: 'Centro de Resultados' },
    { from: /Centros de costos/g, to: 'Centros de Resultados' },
    { from: /Centro de costo/g, to: 'Centro de Resultados' },
    { from: /centro de costos/g, to: 'centro de resultados' },
    { from: /centros de costos/g, to: 'centros de resultados' },
    { from: /centro de costo/g, to: 'centro de resultados' },
    { from: /CostCenter/g, to: 'ResultCenter' },
    { from: /costCenterId/g, to: 'resultCenterId' },
    { from: /CostCenterId/g, to: 'ResultCenterId' },
    { from: /costCenter/g, to: 'resultCenter' },
    { from: /CostCenterType/g, to: 'ResultCenterType' },
    { from: /CostCenterSummary/g, to: 'ResultCenterSummary' },
];

function processFile(filePath: string) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    for (const replacement of replacements) {
        if (replacement.from.test(content)) {
            content = content.replace(replacement.from, replacement.to);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function walk(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (extensions.includes(path.extname(fullPath))) {
            processFile(fullPath);
        }
    }
}

const root = process.cwd();
for (const folder of folders) {
    const folderPath = path.join(root, folder);
    if (fs.existsSync(folderPath)) {
        walk(folderPath);
    }
}
