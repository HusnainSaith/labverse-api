// import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// import { ClientPlanQuotation } from '../../../client-plan-quotations/entities/client-plan-quotation.entity';
// import { Invoice } from '../../../billing/invoices/entities/invoice.entity';
// import { Project } from 'src/modules/project-management/projects/entities/projects.entity';

// @Entity('clients')
// export class Client {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ type: 'varchar', length: 255, nullable: false })
//   name: string;

//   @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
//   email: string;

//   @Column({ type: 'varchar', length: 20, nullable: true })
//   phone: string;

//   @Column({ type: 'varchar', length: 100, nullable: true })
//   company: string;

//   @Column({ type: 'varchar', length: 255, nullable: true })
//   address: string;

//   @Column({ type: 'varchar', length: 255, nullable: true })
//   website: string;

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   created_at: Date;

//   @Column({
//     type: 'timestamp',
//     default: () => 'CURRENT_TIMESTAMP',
//     onUpdate: 'CURRENT_TIMESTAMP',
//   })
//   updated_at: Date;

//   // Relationships (assuming these entities exist and reference Client)
//   @OneToMany(() => ClientPlanQuotation, (quotation) => quotation.client)
//   clientPlanQuotations: ClientPlanQuotation[];

//   @OneToMany(() => Invoice, (invoice) => invoice.client)
//   invoices: Invoice[];

//    @OneToMany(() => Project, (project) => project.client)
//   projects: Project[];
// }


// src/clients/entities/clients.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ClientPlanQuotation } from '../../../client-plan-quotations/entities/client-plan-quotation.entity';
import { Invoice } from '../../../billing/invoices/entities/invoice.entity';
import { Project } from 'src/modules/project-management/projects/entities/projects.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  company: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'profile_photo' })
  profilePhoto: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => ClientPlanQuotation, (quotation) => quotation.client)
  clientPlanQuotations: ClientPlanQuotation[];

  @OneToMany(() => Invoice, (invoice) => invoice.client)
  invoices: Invoice[];

  @OneToMany(() => Project, (project) => project.client)
  projects: Project[];
}
