import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { EmployeeProfile } from '../../employees/entities/employee.entity';
import { Skill } from '../../skills/entities/skills.entity';

@Entity('employee_skills')
export class EmployeeSkill {
  @PrimaryColumn({ name: 'employee_profile_id', type: 'uuid' })
  employeeId: string;

  @PrimaryColumn({ name: 'skill_id', type: 'uuid' })
  skillId: string;

  @Column({
    name: 'proficiency_level',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  proficiencyLevel: string;

  @Column({ name: 'years_of_experience', type: 'int', nullable: true })
  yearsOfExperience: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => EmployeeProfile)
  @JoinColumn({ name: 'employee_profile_id' })
  employee: EmployeeProfile;

  @ManyToOne(() => Skill)
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;
}
