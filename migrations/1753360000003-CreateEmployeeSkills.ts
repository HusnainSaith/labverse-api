import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmployeeSkills1753360000003 implements MigrationInterface {
  name = 'CreateEmployeeSkills1753360000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create employee_skills junction table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS employee_skills (
        employee_profile_id UUID NOT NULL,
        skill_id UUID NOT NULL,
        proficiency_level VARCHAR(50),
        years_of_experience INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (e89mployee_profile_id, skill_id),
        CONSTRAINT fk_employee_skills_profile FOREIGN KEY (employee_profile_id) REFERENCES employee_profiles(id) ON DELETE CASCADE,
        CONSTRAINT fk_employee_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
      );
    `);

    // Add indexes for employee_skills
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_employee_skills_profile_id ON employee_skills(employee_profile_id);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_employee_skills_skill_id ON employee_skills(skill_id);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_employee_skills_proficiency_level ON employee_skills(proficiency_level);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables and indexes
    await queryRunner.query(`DROP INDEX IF EXISTS idx_employee_skills_proficiency_level;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_employee_skills_skill_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_employee_skills_profile_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS employee_skills;`);
  }
}
