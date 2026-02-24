import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class CreateInstallmentsTable1708595200000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
