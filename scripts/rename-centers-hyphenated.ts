import * as fs from 'fs';
import * as path from 'path';

const folders = ['next', 'docs', 'data'];
const extensions = ['.ts', '.tsx', '.md'];

const replacements = [
    { from: /cost-centers/g, to: 'result-centers' },
    { from: /cost-center/g, to: 'result-center' },
    { from: /COST_CENTER_SETTINGS_PATH/g, to: 'RESULT_CENTER_SETTINGS_PATH' },
    { from: /COST_CENTER_BUDGETS_PATH/g, to: 'RESULT_CENTER_BUDGETS_PATH' },
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
