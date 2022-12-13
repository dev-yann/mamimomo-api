import { MigrationInterface, QueryRunner } from 'typeorm';

export class mangoPay1623925548190 implements MigrationInterface {
  name = 'mangoPay1623925548190';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "birthday" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "country" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "nationality" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "mangoPayId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "mangoPayWalletId" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "mangoPayWalletId"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mangoPayId"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "nationality"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "country"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birthday"`);
  }
}
