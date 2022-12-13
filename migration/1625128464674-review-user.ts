import { MigrationInterface, QueryRunner } from 'typeorm';

export class reviewUser1625128464674 implements MigrationInterface {
  name = 'reviewUser1625128464674';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "firstname" TO "firstName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "lastname" TO "lastName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "country" TO "countryOfResidence"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "firstName" TO "firstname"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "lastName" TO "lastname"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "countryOfResidence" TO "country"`,
    );
  }
}
