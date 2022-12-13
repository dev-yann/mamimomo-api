import { MigrationInterface, QueryRunner } from 'typeorm';

export class reviewUser1625146341626 implements MigrationInterface {
  name = 'reviewUser1625146341626';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "countryOfResidence" type character varying(2)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "countryOfResidence" type character varying(250)`,
    );
  }
}
