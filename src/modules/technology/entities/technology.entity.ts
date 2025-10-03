import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { DevelopmentPlanTechnology } from '../../development/development-plan-technologies/entities/development-plan-technology.entity';

@Entity({ name: 'technologies' })
export class Technology {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ nullable: true, length: 255 })
  description: string;

  @Column({ nullable: true, length: 100 })
  category: string;

  @Column({ nullable: true, length: 500 })
  logo: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => DevelopmentPlanTechnology, (dpt) => dpt.technology)
  developmentPlanTechnologies: DevelopmentPlanTechnology[]; // This property name matches the error
}
