import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLogoToTechnologies1753360000025 implements MigrationInterface {
  name = 'AddLogoToTechnologies1753360000025';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE technologies 
      ADD COLUMN logo VARCHAR(500);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE technologies 
      DROP COLUMN logo;
    `);
  }
}