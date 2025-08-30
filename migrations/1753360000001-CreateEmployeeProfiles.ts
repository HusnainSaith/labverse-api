import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmployeeProfiles1753360000001 implements MigrationInterface {
  name = 'CreateEmployeeProfiles1753360000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create employee_profiles table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS employee_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE NOT NULL,
        employee_code VARCHAR(100) UNIQUE NOT NULL,
        hire_date DATE,
        job_title VARCHAR(255),
        department VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active' NOT NULL,
        "profile_image" varchar(2048) NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_employee_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Add indexes for employee_profiles
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_employee_profiles_user_id ON employee_profiles(user_id);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_employee_profiles_employee_code ON employee_profiles(employee_code);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_employee_profiles_department ON employee_profiles(department);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_employee_profiles_job_title ON employee_profiles(job_title);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables and indexes in reverse order of creation
    await queryRunner.query(`DROP INDEX IF EXISTS idx_employee_profiles_job_title;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_employee_profiles_department;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_employee_profiles_employee_code;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_employee_profiles_user_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS employee_profiles;`);
  }
}
