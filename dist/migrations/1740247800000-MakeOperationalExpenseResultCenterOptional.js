"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeOperationalExpenseResultCenterOptional1740247800000 = void 0;
class MakeOperationalExpenseResultCenterOptional1740247800000 {
    constructor() {
        this.name = 'MakeOperationalExpenseResultCenterOptional1740247800000';
    }
    async up(queryRunner) {
        const hasTable = await queryRunner.hasTable('operational_expenses');
        if (!hasTable) {
            console.log('[Migration] Table operational_expenses does not exist, skipping migration');
            return;
        }
        await queryRunner.query(`ALTER TABLE \`operational_expenses\` DROP FOREIGN KEY \`FK_1101c24f34234bc3f890acdab51\``);
        await queryRunner.query(`ALTER TABLE \`operational_expenses\` MODIFY COLUMN \`resultCenterId\` char(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`operational_expenses\` ADD CONSTRAINT \`FK_1101c24f34234bc3f890acdab51\` 
             FOREIGN KEY (\`resultCenterId\`) REFERENCES \`result_centers\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        console.log('[Migration] Made resultCenterId nullable in operational_expenses table');
    }
    async down(queryRunner) {
        const hasTable = await queryRunner.hasTable('operational_expenses');
        if (!hasTable) {
            console.log('[Migration] Table operational_expenses does not exist, skipping migration rollback');
            return;
        }
        await queryRunner.query(`ALTER TABLE \`operational_expenses\` DROP FOREIGN KEY \`FK_1101c24f34234bc3f890acdab51\``);
        await queryRunner.query(`ALTER TABLE \`operational_expenses\` MODIFY COLUMN \`resultCenterId\` char(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`operational_expenses\` ADD CONSTRAINT \`FK_1101c24f34234bc3f890acdab51\` 
             FOREIGN KEY (\`resultCenterId\`) REFERENCES \`result_centers\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        console.log('[Migration] Made resultCenterId NOT NULL in operational_expenses table');
    }
}
exports.MakeOperationalExpenseResultCenterOptional1740247800000 = MakeOperationalExpenseResultCenterOptional1740247800000;
//# sourceMappingURL=1740247800000-MakeOperationalExpenseResultCenterOptional.js.map