import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateReportEntityFields1714367532723
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adiciona os novos campos
    await queryRunner.query(`
      ALTER TABLE "report" 
      ADD COLUMN IF NOT EXISTS "descricaoOcorrido" TEXT,
      ADD COLUMN IF NOT EXISTS "descricaoSuspeito" TEXT
    `);

    // Migra os dados do campo detalhes para descricaoOcorrido
    await queryRunner.query(`
      UPDATE "report"
      SET "descricaoOcorrido" = "detalhes"
    `);

    // Garante que descricaoOcorrido não seja null
    await queryRunner.query(`
      UPDATE "report"
      SET "descricaoOcorrido" = '(Sem descrição)' 
      WHERE "descricaoOcorrido" IS NULL
    `);

    // Torna descricaoOcorrido NOT NULL após a migração dos dados
    await queryRunner.query(`
      ALTER TABLE "report" 
      ALTER COLUMN "descricaoOcorrido" SET NOT NULL
    `);

    // Remove o campo detalhes
    await queryRunner.query(`
      ALTER TABLE "report" 
      DROP COLUMN IF EXISTS "detalhes"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Adiciona o campo detalhes novamente
    await queryRunner.query(`
      ALTER TABLE "report" 
      ADD COLUMN IF NOT EXISTS "detalhes" TEXT
    `);

    // Combina os dados dos campos descricaoOcorrido e descricaoSuspeito
    await queryRunner.query(`
      UPDATE "report"
      SET "detalhes" = "descricaoOcorrido" || 
        CASE WHEN "descricaoSuspeito" IS NOT NULL AND "descricaoSuspeito" <> '' 
             THEN E'\n\nSuspeito: ' || "descricaoSuspeito" 
             ELSE '' 
        END
    `);

    // Torna detalhes NOT NULL
    await queryRunner.query(`
      ALTER TABLE "report" 
      ALTER COLUMN "detalhes" SET NOT NULL
    `);

    // Remove os campos adicionados
    await queryRunner.query(`
      ALTER TABLE "report" 
      DROP COLUMN IF EXISTS "descricaoOcorrido",
      DROP COLUMN IF EXISTS "descricaoSuspeito"
    `);
  }
}
