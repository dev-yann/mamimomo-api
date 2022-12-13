import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateOrderDetail1641477483416 implements MigrationInterface {
  name = 'updateOrderDetail1641477483416';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" ADD "storeId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "order_detail" ADD "title" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_detail" ADD "description" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "order_detail" ADD "price" integer`);
    await queryRunner.query(`ALTER TABLE "order_detail" ADD "unit" integer`);
    await queryRunner.query(
      `ALTER TABLE "order_detail" ADD "category" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_1a79b2f719ecd9f307d62b81093" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_1a79b2f719ecd9f307d62b81093"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_detail" DROP COLUMN "category"`,
    );
    await queryRunner.query(`ALTER TABLE "order_detail" DROP COLUMN "unit"`);
    await queryRunner.query(`ALTER TABLE "order_detail" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "order_detail" DROP COLUMN "description"`,
    );
    await queryRunner.query(`ALTER TABLE "order_detail" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "storeId"`);
  }
}
