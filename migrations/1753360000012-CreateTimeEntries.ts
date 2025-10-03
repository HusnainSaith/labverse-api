import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTimeEntries1753360000012 implements MigrationInterface {
  name = 'CreateTimeEntries1753360000012';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS time_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        employee_profile_id UUID NOT NULL,
        project_id UUID NOT NULL,
        task_id UUID,
        date DATE NOT NULL,
        hours NUMERIC(5,2) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_time_entries_employee FOREIGN KEY (employee_profile_id) REFERENCES employee_profiles(id) ON DELETE RESTRICT,
        CONSTRAINT fk_time_entries_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        CONSTRAINT fk_time_entries_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_time_entries_employee_id ON time_entries(employee_profile_id);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_time_entries_project_id ON time_entries(project_id);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_time_entries_task_id ON time_entries(task_id);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_time_entries_date ON time_entries(date);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_time_entries_date;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_time_entries_task_id;`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_time_entries_project_id;`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_time_entries_employee_id;`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS time_entries;`);
  }
}
