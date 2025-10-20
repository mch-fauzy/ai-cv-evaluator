import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1760930372385 implements MigrationInterface {
    name = 'InitialSchema1760930372385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" uuid, "cloudinary_public_id" character varying NOT NULL, "cloudinary_url" character varying NOT NULL, "file_type" character varying NOT NULL, "file_size" bigint NOT NULL, "original_name" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c683dd5015488a9fd6d9a623e2" ON "file" ("created_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_9e611ff1285f677015f0ee3e63" ON "file" ("updated_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_a04e93eaafb5d72572a5ccb161" ON "file" ("deleted_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_b675c637c993c0d6a8730aaea4" ON "file" ("file_type") `);
        await queryRunner.query(`CREATE TABLE "evaluation_job" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" uuid, "job_title" character varying(200) NOT NULL, "cv_file_id" uuid NOT NULL, "report_file_id" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', CONSTRAINT "PK_83d2e94d34a81c05a4fd9bc5f31" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5a52c4c7bd15122fa0f0abf19f" ON "evaluation_job" ("created_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_8785a85b5c8a8a9a94bc0e3dec" ON "evaluation_job" ("updated_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_f16815071aec2e73345a768040" ON "evaluation_job" ("deleted_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_b46a5d46f30d02ff5ff03c76fa" ON "evaluation_job" ("cv_file_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ac5f44e60a3a2cf91c098047a9" ON "evaluation_job" ("report_file_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c49812dfa16ca71f69397e28b6" ON "evaluation_job" ("status") `);
        await queryRunner.query(`CREATE TABLE "evaluation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" uuid, "job_id" uuid NOT NULL, "cv_match_rate" numeric(5,2) NOT NULL, "cv_feedback" text NOT NULL, "project_score" numeric(5,2) NOT NULL, "project_feedback" text NOT NULL, "overall_summary" text NOT NULL, CONSTRAINT "REL_83d2e94d34a81c05a4fd9bc5f3" UNIQUE ("job_id"), CONSTRAINT "PK_b72edd439b9db736f55b584fa54" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_559c736af44cf9e82286e63212" ON "evaluation" ("created_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_9e02cd871fa91f21cb552642f3" ON "evaluation" ("updated_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_da14e9573743d626ce653c73bf" ON "evaluation" ("deleted_by") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_83d2e94d34a81c05a4fd9bc5f3" ON "evaluation" ("job_id") `);
        await queryRunner.query(`ALTER TABLE "evaluation_job" ADD CONSTRAINT "FK_b46a5d46f30d02ff5ff03c76faf" FOREIGN KEY ("cv_file_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "evaluation_job" ADD CONSTRAINT "FK_ac5f44e60a3a2cf91c098047a9d" FOREIGN KEY ("report_file_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "evaluation" ADD CONSTRAINT "FK_83d2e94d34a81c05a4fd9bc5f31" FOREIGN KEY ("job_id") REFERENCES "evaluation_job"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "evaluation" DROP CONSTRAINT "FK_83d2e94d34a81c05a4fd9bc5f31"`);
        await queryRunner.query(`ALTER TABLE "evaluation_job" DROP CONSTRAINT "FK_ac5f44e60a3a2cf91c098047a9d"`);
        await queryRunner.query(`ALTER TABLE "evaluation_job" DROP CONSTRAINT "FK_b46a5d46f30d02ff5ff03c76faf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_83d2e94d34a81c05a4fd9bc5f3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_da14e9573743d626ce653c73bf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9e02cd871fa91f21cb552642f3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_559c736af44cf9e82286e63212"`);
        await queryRunner.query(`DROP TABLE "evaluation"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c49812dfa16ca71f69397e28b6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac5f44e60a3a2cf91c098047a9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b46a5d46f30d02ff5ff03c76fa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f16815071aec2e73345a768040"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8785a85b5c8a8a9a94bc0e3dec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5a52c4c7bd15122fa0f0abf19f"`);
        await queryRunner.query(`DROP TABLE "evaluation_job"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b675c637c993c0d6a8730aaea4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a04e93eaafb5d72572a5ccb161"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9e611ff1285f677015f0ee3e63"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c683dd5015488a9fd6d9a623e2"`);
        await queryRunner.query(`DROP TABLE "file"`);
    }

}
