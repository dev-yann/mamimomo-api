import {MigrationInterface, QueryRunner} from "typeorm";

export class fixDateFieldIssue1614935225326 implements MigrationInterface {
    name = 'fixDateFieldIssue1614935225326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "deleted_at" TIME`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "updated_at" TIME NOT NULL DEFAULT '12:36:05.56788'`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "created_at" TIME NOT NULL DEFAULT '12:36:05.56788'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deleted_at" TIME`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updated_at" TIME NOT NULL DEFAULT '12:36:05.56788'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_at" TIME NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "deleted_at" TIME`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "updated_at" TIME NOT NULL DEFAULT '12:36:05.56788'`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "created_at" TIME NOT NULL DEFAULT '12:36:05.56788'`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "deleted_at" TIME`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "updated_at" TIME NOT NULL DEFAULT '12:36:05.56788'`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "created_at" TIME NOT NULL DEFAULT '12:36:05.56788'`);
    }

}
