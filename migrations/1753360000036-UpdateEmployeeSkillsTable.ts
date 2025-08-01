import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEmployeeSkillsTable1753360000036 implements MigrationInterface {
  name = 'UpdateEmployeeSkillsTable1753360000036';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing table and recreate with proper structure
    await queryRunner.query(`DROP TABLE IF EXISTS employee_skills CASCADE;`);
    
    await queryRunner.query(`
      CREATE TABLE employee_skills (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        employee_id UUID NOT NULL,
        skill_id UUID NOT NULL,
        proficiency_level INTEGER DEFAULT 1,
        years_of_experience INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_employee_skills_profile FOREIGN KEY (employee_id) REFERENCES employee_profiles(id) ON DELETE CASCADE,
        CONSTRAINT fk_employee_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
        CONSTRAINT uk_employee_skill UNIQUE (employee_id, skill_id)
      );
    `);

    // Add indexes
    await queryRunner.query(`CREATE INDEX idx_employee_skills_employee_id ON employee_skills(employee_id);`);
    await queryRunner.query(`CREATE INDEX idx_employee_skills_skill_id ON employee_skills(skill_id);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS employee_skills CASCADE;`);
  }
}