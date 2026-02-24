"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReceptionEntities1708732800000 = void 0;
class CreateReceptionEntities1708732800000 {
    constructor() {
        this.name = 'CreateReceptionEntities1708732800000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`receptions\` (
                \`id\` VARCHAR(36) NOT NULL DEFAULT (UUID()),
                \`type\` VARCHAR(50) NOT NULL DEFAULT 'direct',
                \`storageId\` VARCHAR(36) NULL,
                \`branchId\` VARCHAR(36) NULL,
                \`supplierId\` VARCHAR(36) NULL,
                \`userId\` VARCHAR(36) NULL,
                \`reference\` VARCHAR(255) NULL,
                \`documentNumber\` VARCHAR(255) NULL,
                \`notes\` TEXT NULL,
                \`subtotal\` DECIMAL(15,2) NOT NULL DEFAULT 0,
                \`taxAmount\` DECIMAL(15,2) NOT NULL DEFAULT 0,
                \`discountAmount\` DECIMAL(15,2) NOT NULL DEFAULT 0,
                \`total\` DECIMAL(15,2) NOT NULL DEFAULT 0,
                \`lineCount\` INT NOT NULL DEFAULT 0,
                \`transactionId\` VARCHAR(36) NULL,
                \`payments\` JSON NULL,
                \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        `);
        await queryRunner.query(`CREATE INDEX \`IDX_receptions_storageId\` ON \`receptions\` (\`storageId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_receptions_supplierId\` ON \`receptions\` (\`supplierId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_receptions_branchId\` ON \`receptions\` (\`branchId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_receptions_createdAt\` ON \`receptions\` (\`createdAt\`)`);
        await queryRunner.query(`
            CREATE TABLE \`reception_lines\` (
                \`id\` VARCHAR(36) NOT NULL DEFAULT (UUID()),
                \`receptionId\` VARCHAR(36) NOT NULL,
                \`productId\` VARCHAR(36) NULL,
                \`productVariantId\` VARCHAR(36) NULL,
                \`productName\` VARCHAR(255) NOT NULL,
                \`sku\` VARCHAR(100) NULL,
                \`variantName\` VARCHAR(255) NULL,
                \`quantity\` DECIMAL(15,4) NOT NULL,
                \`receivedQuantity\` DECIMAL(15,4) NULL,
                \`unitPrice\` DECIMAL(15,2) NOT NULL,
                \`unitCost\` DECIMAL(15,2) NULL,
                \`subtotal\` DECIMAL(15,2) NOT NULL DEFAULT 0,
                \`lineNumber\` INT NOT NULL DEFAULT 1,
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        `);
        await queryRunner.query(`CREATE INDEX \`IDX_reception_lines_receptionId\` ON \`reception_lines\` (\`receptionId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_reception_lines_productVariantId\` ON \`reception_lines\` (\`productVariantId\`)`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`reception_lines\` DROP FOREIGN KEY \`FK_reception_lines_productVariant\``);
        await queryRunner.query(`ALTER TABLE \`reception_lines\` DROP FOREIGN KEY \`FK_reception_lines_product\``);
        await queryRunner.query(`ALTER TABLE \`reception_lines\` DROP FOREIGN KEY \`FK_reception_lines_reception\``);
        await queryRunner.query(`ALTER TABLE \`receptions\` DROP FOREIGN KEY \`FK_receptions_user\``);
        await queryRunner.query(`ALTER TABLE \`receptions\` DROP FOREIGN KEY \`FK_receptions_supplier\``);
        await queryRunner.query(`ALTER TABLE \`receptions\` DROP FOREIGN KEY \`FK_receptions_branch\``);
        await queryRunner.query(`ALTER TABLE \`receptions\` DROP FOREIGN KEY \`FK_receptions_storage\``);
        await queryRunner.query(`DROP INDEX \`IDX_reception_lines_productVariantId\` ON \`reception_lines\``);
        await queryRunner.query(`DROP INDEX \`IDX_reception_lines_receptionId\` ON \`reception_lines\``);
        await queryRunner.query(`DROP INDEX \`IDX_receptions_createdAt\` ON \`receptions\``);
        await queryRunner.query(`DROP INDEX \`IDX_receptions_branchId\` ON \`receptions\``);
        await queryRunner.query(`DROP INDEX \`IDX_receptions_supplierId\` ON \`receptions\``);
        await queryRunner.query(`DROP INDEX \`IDX_receptions_storageId\` ON \`receptions\``);
        await queryRunner.query(`DROP TABLE \`reception_lines\``);
        await queryRunner.query(`DROP TABLE \`receptions\``);
    }
}
exports.CreateReceptionEntities1708732800000 = CreateReceptionEntities1708732800000;
//# sourceMappingURL=1708732800000-CreateReceptionEntities.js.map