"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddInstallmentSourceFields1740282400000 = void 0;
class AddInstallmentSourceFields1740282400000 {
    constructor() {
        this.name = 'AddInstallmentSourceFields1740282400000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE \`installments\`
      MODIFY COLUMN \`saleTransactionId\` VARCHAR(36) NULL
    `);
        await queryRunner.query(`
      ALTER TABLE \`installments\`
      ADD COLUMN \`sourceType\` VARCHAR(50) NOT NULL DEFAULT 'SALE',
      ADD COLUMN \`sourceTransactionId\` VARCHAR(36) NULL,
      ADD COLUMN \`payeeType\` VARCHAR(50) NULL,
      ADD COLUMN \`payeeId\` VARCHAR(255) NULL
    `);
        await queryRunner.query(`
      CREATE INDEX \`IDX_installments_source\` ON \`installments\` (\`sourceType\`, \`sourceTransactionId\`)
    `);
        await queryRunner.query(`
      CREATE INDEX \`IDX_installments_payee\` ON \`installments\` (\`payeeType\`, \`payeeId\`)
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX \`IDX_installments_payee\` ON \`installments\``);
        await queryRunner.query(`DROP INDEX \`IDX_installments_source\` ON \`installments\``);
        await queryRunner.query(`
      ALTER TABLE \`installments\`
      DROP COLUMN \`payeeId\`,
      DROP COLUMN \`payeeType\`,
      DROP COLUMN \`sourceTransactionId\`,
      DROP COLUMN \`sourceType\`
    `);
        await queryRunner.query(`
      ALTER TABLE \`installments\`
      MODIFY COLUMN \`saleTransactionId\` VARCHAR(36) NOT NULL
    `);
    }
}
exports.AddInstallmentSourceFields1740282400000 = AddInstallmentSourceFields1740282400000;
//# sourceMappingURL=1740282400000-AddInstallmentSourceFields.js.map