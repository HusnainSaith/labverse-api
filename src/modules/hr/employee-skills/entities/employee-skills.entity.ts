import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeeProfile } from '../../employees/entities/employee.entity';
import { Skill } from '../../skills/entities/skills.entity';

@Entity('employee_skills')
export class EmployeeSkill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'skill_id', type: 'uuid' })
  skillId: string;

  @Column({ name: 'proficiency_level', type: 'int', default: 1 })
  proficiencyLevel: number;

  @Column({ name: 'years_of_experience', type: 'int', default: 0 })
  yearsOfExperience: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => EmployeeProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeProfile;

  @ManyToOne(() => Skill, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;
}
