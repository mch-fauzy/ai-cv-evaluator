import { MigrationInterface, QueryRunner } from "typeorm";
export declare class Initial1760960984357 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
