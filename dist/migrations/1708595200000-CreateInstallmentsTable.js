"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInstallmentsTable1708595200000 = void 0;
class CreateInstallmentsTable1708595200000 {
    constructor() {
        this.name = 'CreateInstallmentsTable1708595200000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`installments\` (
                \`id\` VARCHAR(36) NOT NULL DEFAULT (UUID()),
                \`saleTransactionId\` VARCHAR(36) NOT NULL,
                \`installmentNumber\` INT NOT NULL,
                \`totalInstallments\` INT NOT NULL,
                \`amount\` DECIMAL(15,2) NOT NULL,
                \`dueDate\` DATE NOT NULL,
                \`amountPaid\` DECIMAL(15,2) NOT NULL DEFAULT 0,
                \`status\` ENUM('PENDING', 'PARTIAL', 'PAID', 'OVERDUE') NOT NULL DEFAULT 'PENDING',
                \`paymentTransactionId\` VARCHAR(36) NULL,
                \`metadata\` JSON NULL,
                \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        `);
        await queryRunner.query(`
            CREATE INDEX \`IDX_installments_sale_number\` 
            ON \`installments\` (\`saleTransactionId\`, \`installmentNumber\`)
        `);
        await queryRunner.query(`
            CREATE INDEX \`IDX_installments_dueDate\` 
            ON \`installments\` (\`dueDate\`)
        `);
        await queryRunner.query(`
            CREATE INDEX \`IDX_installments_status\` 
            ON \`installments\` (\`status\`)
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`installments\` 
            DROP FOREIGN KEY \`FK_installments_payment_transaction\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`installments\` 
            DROP FOREIGN KEY \`FK_installments_sale_transaction\`
        `);
        await queryRunner.query(`DROP INDEX \`IDX_installments_status\` ON \`installments\``);
        await queryRunner.query(`DROP INDEX \`IDX_installments_dueDate\` ON \`installments\``);
        await queryRunner.query(`DROP INDEX \`IDX_installments_sale_number\` ON \`installments\``);
        await queryRunner.query(`DROP TABLE \`installments\``);
    }
}
exports.CreateInstallmentsTable1708595200000 = CreateInstallmentsTable1708595200000;
//# sourceMappingURL=1708595200000-CreateInstallmentsTable.js.map