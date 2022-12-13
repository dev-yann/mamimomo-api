import {MigrationInterface, QueryRunner} from "typeorm";

export class productPublish1625760084677 implements MigrationInterface {
    name = 'productPublish1625760084677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "publish" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "publish"`);
    }

}
