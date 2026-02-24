import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateReceptionEntities1708732800000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
