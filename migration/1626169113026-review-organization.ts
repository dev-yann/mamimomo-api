import {MigrationInterface, QueryRunner} from "typeorm";

export class reviewOrganization1626169113026 implements MigrationInterface {
    name = 'reviewOrganization1626169113026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "organization"."description" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "organization"."description" IS NULL`);
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "description" SET NOT NULL`);
    }

}
