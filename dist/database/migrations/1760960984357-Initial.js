"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Initial1760960984357 = void 0;
class Initial1760960984357 {
    name = 'Initial1760960984357';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "upload" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" uuid, "cloudinary_public_id" character varying NOT NULL, "cloudinary_url" character varying NOT NULL, "file_type" character varying NOT NULL, "file_size" bigint NOT NULL, "original_name" character varying NOT NULL, CONSTRAINT "PK_1fe8db121b3de4ddfa677fc51f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_34711f142c58dedff872210e28" ON "upload" ("created_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_860fbe9ad8f0fe9444bb8018d6" ON "upload" ("updated_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_ec83e06a83d7f2712721c97f28" ON "upload" ("deleted_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_446249588e9523cf80032eae1b" ON "upload" ("file_type") `);
        await queryRunner.query(`CREATE TABLE "evaluation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" uuid, "job_title" character varying(200) NOT NULL, "cv_file_id" uuid NOT NULL, "project_file_id" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', CONSTRAINT "PK_b72edd439b9db736f55b584fa54" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_559c736af44cf9e82286e63212" ON "evaluation" ("created_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_9e02cd871fa91f21cb552642f3" ON "evaluation" ("updated_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_da14e9573743d626ce653c73bf" ON "evaluation" ("deleted_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_625d62855057ed81ed0757cb5b" ON "evaluation" ("cv_file_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7d4d198a9a1e6057407ed642c4" ON "evaluation" ("project_file_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e52d2a61b91463f795bc272e57" ON "evaluation" ("status") `);
        await queryRunner.query(`CREATE TABLE "result" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" uuid, "evaluation_id" uuid NOT NULL, "cv_match_rate" numeric(5,2) NOT NULL, "cv_feedback" text NOT NULL, "project_score" numeric(5,2) NOT NULL, "project_feedback" text NOT NULL, "overall_summary" text NOT NULL, CONSTRAINT "REL_d223789fcd0c6bf77442b36a61" UNIQUE ("evaluation_id"), CONSTRAINT "PK_c93b145f3c2e95f6d9e21d188e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fea91e52131de09b1c76ce144a" ON "result" ("created_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_a09d2dfdc4b8b393708b93195e" ON "result" ("updated_by") `);
        await queryRunner.query(`CREATE INDEX "IDX_ffb9d9b20ba86bc574464590a4" ON "result" ("deleted_by") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d223789fcd0c6bf77442b36a61" ON "result" ("evaluation_id") `);
        await queryRunner.query(`ALTER TABLE "evaluation" ADD CONSTRAINT "FK_625d62855057ed81ed0757cb5b0" FOREIGN KEY ("cv_file_id") REFERENCES "upload"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "evaluation" ADD CONSTRAINT "FK_7d4d198a9a1e6057407ed642c4e" FOREIGN KEY ("project_file_id") REFERENCES "upload"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "result" ADD CONSTRAINT "FK_d223789fcd0c6bf77442b36a61f" FOREIGN KEY ("evaluation_id") REFERENCES "evaluation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "result" DROP CONSTRAINT "FK_d223789fcd0c6bf77442b36a61f"`);
        await queryRunner.query(`ALTER TABLE "evaluation" DROP CONSTRAINT "FK_7d4d198a9a1e6057407ed642c4e"`);
        await queryRunner.query(`ALTER TABLE "evaluation" DROP CONSTRAINT "FK_625d62855057ed81ed0757cb5b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d223789fcd0c6bf77442b36a61"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ffb9d9b20ba86bc574464590a4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a09d2dfdc4b8b393708b93195e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fea91e52131de09b1c76ce144a"`);
        await queryRunner.query(`DROP TABLE "result"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e52d2a61b91463f795bc272e57"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7d4d198a9a1e6057407ed642c4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_625d62855057ed81ed0757cb5b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_da14e9573743d626ce653c73bf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9e02cd871fa91f21cb552642f3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_559c736af44cf9e82286e63212"`);
        await queryRunner.query(`DROP TABLE "evaluation"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_446249588e9523cf80032eae1b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ec83e06a83d7f2712721c97f28"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_860fbe9ad8f0fe9444bb8018d6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_34711f142c58dedff872210e28"`);
        await queryRunner.query(`DROP TABLE "upload"`);
    }
}
exports.Initial1760960984357 = Initial1760960984357;
//# sourceMappingURL=1760960984357-Initial.js.map