"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddParentTransactionId1740248276000 = void 0;
const typeorm_1 = require("typeorm");
class AddParentTransactionId1740248276000 {
    async up(queryRunner) {
        await queryRunner.addColumn('transactions', new typeorm_1.TableColumn({
            name: 'parentTransactionId',
            type: 'char',
            length: '36',
            isNullable: true,
        }));
        await queryRunner.createForeignKey('transactions', new typeorm_1.TableForeignKey({
            name: 'FK_transactions_parentTransactionId',
            columnNames: ['parentTransactionId'],
            referencedTableName: 'transactions',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropForeignKey('transactions', 'FK_transactions_parentTransactionId');
        await queryRunner.dropColumn('transactions', 'parentTransactionId');
    }
}
exports.AddParentTransactionId1740248276000 = AddParentTransactionId1740248276000;
//# sourceMappingURL=1740248276000-AddParentTransactionId.js.map