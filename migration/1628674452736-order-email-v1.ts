import {MigrationInterface, QueryRunner} from "typeorm";

export class orderEmailV11628674452736 implements MigrationInterface {
    name = 'orderEmailV11628674452736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "seller"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customer"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "total" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "customerId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "sellerId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "payInId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_time_slot" ALTER COLUMN "start" TYPE TIME`);
        await queryRunner.query(`COMMENT ON COLUMN "store_time_slot"."start" IS NULL`);
        await queryRunner.query(`ALTER TABLE "store_time_slot" ALTER COLUMN "end" TYPE TIME`);
        await queryRunner.query(`COMMENT ON COLUMN "store_time_slot"."end" IS NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_8a583acc24e13bcf84b1b9d0d20" FOREIGN KEY ("sellerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_8a583acc24e13bcf84b1b9d0d20"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_124456e637cca7a415897dce659"`);
        await queryRunner.query(`COMMENT ON COLUMN "store_time_slot"."end" IS NULL`);
        await queryRunner.query(`ALTER TABLE "store_time_slot" ALTER COLUMN "end" TYPE TIME(0)`);
        await queryRunner.query(`COMMENT ON COLUMN "store_time_slot"."start" IS NULL`);
        await queryRunner.query(`ALTER TABLE "store_time_slot" ALTER COLUMN "start" TYPE TIME(0)`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "payInId"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "sellerId"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customerId"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "total"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "customer" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "seller" character varying NOT NULL`);
    }

}
