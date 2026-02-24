import * as fs from 'fs';
import * as path from 'path';

const folders = ['next', 'docs', 'data'];
const extensions = ['.ts', '.tsx', '.md', '.sql', '.json'];

const replacements = [
    { from: /Centro de Costos/g, to: 'Centro de Resultados' },
    { from: /Centros de Costos/g, to: 'Centros de Resultados' },
    { from: /Centro de Costo/g, to: 'Centro de Resultados' },
    { from: /centro de costo/gi, to: 'centro de resultados' },
    { from: /centros de costo/gi, to: 'centros de resultados' },
    { from: /cost center/gi, to: 'centro de resultados' }, // For English comments
];

function processFile(filePath: string) {
    if (filePath.includes('.next/')) return;
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
