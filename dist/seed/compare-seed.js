"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const path_1 = require("path");
const fs_1 = require("fs");
const accounting_rule_entity_1 = require("../modules/accounting-rules/domain/accounting-rule.entity");
async function main() {
    const dataSource = new typeorm_1.DataSource({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'flowstore',
        entities: [accounting_rule_entity_1.AccountingRule],
        synchronize: false,
    });
    await dataSource.initialize();
    const ruleRepo = dataSource.getRepository(accounting_rule_entity_1.AccountingRule);
    const dbRules = await ruleRepo.find();
    const jsonPath = (0, path_1.join)(__dirname, 'data', 'accounting-rules.json');
    const jsonText = (0, fs_1.readFileSync)(jsonPath, 'utf8');
    const seedRules = JSON.parse(jsonText);
    const byKey = new Map();
    seedRules.forEach(r => {
        const key = `${r.transactionType}::${r.paymentMethod || ''}`;
        byKey.set(key, r);
    });
    console.log('=== Reglas definidas en seed JSON ===');
    seedRules.forEach(r => console.log(r.ref, r.transactionType, r.paymentMethod || ''));
    console.log('\n=== Reglas que hay en la base de datos ===');
    dbRules.forEach(r => console.log('(no ref)', r.transactionType, r.paymentMethod || ''));
    console.log('\n=== Comparación ===');
    dbRules.forEach(r => {
        const key = `${r.transactionType}::${r.paymentMethod || ''}`;
        const seed = byKey.get(key);
        if (!seed) {
            console.log(`DB extra: ${r.transactionType} ${r.paymentMethod || ''}`);
        }
        else {
            const diffs = [];
            ['debitAccountId', 'creditAccountId', 'priority', 'isActive'].forEach(k => {
                if (r[k] != seed[k]) {
                    diffs.push(`${k}: db='${r[k]}' json='${seed[k]}'`);
                }
            });
            if (diffs.length) {
                console.log(`Mismatch ${seed.ref} -> ${diffs.join(', ')}`);
            }
        }
    });
    seedRules.forEach(r => {
        const key = `${r.transactionType}::${r.paymentMethod || ''}`;
        const found = dbRules.find(d => `${d.transactionType}::${d.paymentMethod || ''}` === key);
        if (!found) {
            console.log(`Missing in DB: ${r.ref}`);
        }
    });
    await dataSource.destroy();
}
main().catch(err => {
    console.error('Error during comparison', err);
    process.exit(1);
});
//# sourceMappingURL=compare-seed.js.map