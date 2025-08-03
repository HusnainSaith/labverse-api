import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProjectMilestones1753360000008 implements MigrationInterface {
  name = 'CreateProjectMilestones1753360000008';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS project_milestones (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        due_date TIMESTAMP WITH TIME ZONE,
        status VARCHAR(50) DEFAULT 'Not Started' NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_project_milestones_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_project_milestones_status ON project_milestones(status);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_project_milestones_status;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_project_milestones_project_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS project_milestones;`);
  }
}
