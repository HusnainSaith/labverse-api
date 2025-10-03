import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSkills1753360000002 implements MigrationInterface {
  name = 'CreateSkills1753360000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) UNIQUE NOT NULL,
        description VARCHAR(255),
        category VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_skills_category;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_skills_name;`);
    await queryRunner.query(`DROP TABLE IF EXISTS skills;`);
  }
}
