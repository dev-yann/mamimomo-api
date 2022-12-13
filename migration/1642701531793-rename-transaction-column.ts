import {MigrationInterface, QueryRunner} from "typeorm";

export class renameTransactionColumn1642701531793 implements MigrationInterface {
    name = 'renameTransactionColumn1642701531793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" RENAME COLUMN "payInId" TO "transactionId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" RENAME COLUMN "transactionId" TO "payInId"`);
    }

}
