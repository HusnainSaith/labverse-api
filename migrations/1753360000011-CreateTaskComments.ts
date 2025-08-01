import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskComments1753360000011 implements MigrationInterface {
  name = 'CreateTaskComments1753360000011';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS task_comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        task_id UUID NOT NULL,
        comment_text TEXT NOT NULL,
        commented_by_employee_profile_id UUID NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_task_comments_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        CONSTRAINT fk_task_comments_commented_by FOREIGN KEY (commented_by_employee_profile_id) REFERENCES employee_profiles(id) ON DELETE RESTRICT
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_comments_commented_by_id ON task_comments(commented_by_employee_profile_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_task_comments_commented_by_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_task_comments_task_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS task_comments;`);
  }
}
