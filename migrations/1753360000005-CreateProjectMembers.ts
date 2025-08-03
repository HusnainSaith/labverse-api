import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProjectMembers1753360000005 implements MigrationInterface {
  name = 'CreateProjectMembers1753360000005';

  
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop tables and indexes if they exist from a previous run to ensure clean creation
    // This is useful during development but should be handled carefully in production.
    await queryRunner.query(`DROP INDEX IF EXISTS idx_project_members_role_on_project;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_project_members_user_id;`); // Drop old user_id index
    await queryRunner.query(`DROP INDEX IF EXISTS idx_project_members_project_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS project_members;`);

    // Create project_members junction table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS project_members (
        project_id UUID NOT NULL,
        employee_profile_id UUID NOT NULL, -- Changed from user_id
        role_on_project VARCHAR(100) NOT NULL,
        assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (project_id, employee_profile_id), -- Changed primary key
        CONSTRAINT fk_project_members_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        CONSTRAINT fk_project_members_employee_profile FOREIGN KEY (employee_profile_id) REFERENCES employee_profiles(id) ON DELETE CASCADE -- Changed FK reference
      );
    `);

    // Add indexes for project_members
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_project_members_employee_profile_id ON project_members(employee_profile_id); -- Changed index name
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_project_members_role_on_project ON project_members(role_on_project);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables and indexes in order to not break FK constraints
    await queryRunner.query(`DROP INDEX IF EXISTS idx_project_members_role_on_project;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_project_members_employee_profile_id;`); // Drop new index name
    await queryRunner.query(`DROP INDEX IF EXISTS idx_project_members_project_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS project_members;`);
  }}