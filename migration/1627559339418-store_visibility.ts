import { MigrationInterface, QueryRunner } from 'typeorm';

export class storeVisibility1627559339418 implements MigrationInterface {
  name = 'storeVisibility1627559339418';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_329b8ae12068b23da547d3b4798"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" RENAME COLUMN "userId" TO "storeId"`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "role" integer`);
    await queryRunner.query(`ALTER TABLE "store" ADD "publish" boolean`);

    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_32eaa54ad96b26459158464379a" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_32eaa54ad96b26459158464379a"`,
    );

    await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "publish"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    await queryRunner.query(
      `ALTER TABLE "product" RENAME COLUMN "storeId" TO "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_329b8ae12068b23da547d3b4798" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
