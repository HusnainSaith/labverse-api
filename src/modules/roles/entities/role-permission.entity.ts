import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Entity('role_permissions')
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roleId: string;

  @Column()
  permissionId: string;

  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  role: Role;

  @ManyToOne(() => Permission, { onDelete: 'CASCADE' })
  permission: Permission;

  @CreateDateColumn()
  createdAt: Date;
}
