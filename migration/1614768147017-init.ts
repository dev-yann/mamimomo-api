import {MigrationInterface, QueryRunner} from "typeorm";

export class init1614768147017 implements MigrationInterface {
    name = 'init1614768147017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying NOT NULL, "city" character varying NOT NULL, "postalCode" character varying NOT NULL, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" integer NOT NULL, "customer" character varying NOT NULL, "seller" character varying NOT NULL, "created_at" TIME NOT NULL DEFAULT 'NOW()', "updated_at" TIME NOT NULL DEFAULT 'NOW()', "deleted_at" TIME DEFAULT null, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "store_time_slot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "day" integer NOT NULL, "start" TIME NOT NULL, "end" TIME NOT NULL, "storeId" uuid NOT NULL, CONSTRAINT "PK_03580f68ba358dc9be7dc32b079" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "store" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "coordinates" geometry(Point,4326), "userId" uuid NOT NULL, "image" character varying DEFAULT null, "addressId" uuid, CONSTRAINT "REL_cd32344f427e665d01b9fb1cd1" UNIQUE ("addressId"), CONSTRAINT "PK_f3172007d4de5ae8e7692759d79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIME NOT NULL DEFAULT 'NOW()', "updated_at" TIME NOT NULL DEFAULT 'NOW()', "deleted_at" TIME DEFAULT null, CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "phone" character varying(15) NOT NULL, "organizationId" uuid, "created_at" TIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIME NOT NULL DEFAULT 'NOW()', "deleted_at" TIME DEFAULT null, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "stock" integer NOT NULL, "price" integer NOT NULL, "sold" integer, "image" character varying, "userId" uuid NOT NULL, "unit" integer NOT NULL, "category" integer NOT NULL, "created_at" TIME NOT NULL DEFAULT 'NOW()', "updated_at" TIME NOT NULL DEFAULT 'NOW()', "deleted_at" TIME DEFAULT null, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total" integer NOT NULL, "quantity" integer NOT NULL, "productId" uuid NOT NULL, "orderId" uuid NOT NULL, CONSTRAINT "PK_0afbab1fa98e2fb0be8e74f6b38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "store_time_slot" ADD CONSTRAINT "FK_1e8b10ec67ea145c113f8eec272" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store" ADD CONSTRAINT "FK_cd32344f427e665d01b9fb1cd1a" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store" ADD CONSTRAINT "FK_3f82dbf41ae837b8aa0a27d29c3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_329b8ae12068b23da547d3b4798" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_a3647bd11aed3cf968c9ce9b835" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_88850b85b38a8a2ded17a1f5369" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_88850b85b38a8a2ded17a1f5369"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_a3647bd11aed3cf968c9ce9b835"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_329b8ae12068b23da547d3b4798"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"`);
        await queryRunner.query(`ALTER TABLE "store" DROP CONSTRAINT "FK_3f82dbf41ae837b8aa0a27d29c3"`);
        await queryRunner.query(`ALTER TABLE "store" DROP CONSTRAINT "FK_cd32344f427e665d01b9fb1cd1a"`);
        await queryRunner.query(`ALTER TABLE "store_time_slot" DROP CONSTRAINT "FK_1e8b10ec67ea145c113f8eec272"`);
        await queryRunner.query(`DROP TABLE "order_detail"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TABLE "store"`);
        await queryRunner.query(`DROP TABLE "store_time_slot"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "address"`);
    }

}
