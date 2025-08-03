import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('client_approvals')
export class ClientApproval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'clientId' })
  clientId: string;

  @Column({ name: 'deliverableId' })
  deliverableId: string;

  @Column({ name: 'requestDetails', type: 'text' })
  requestDetails: string;

  @Column({ type: 'enum', enum: ApprovalStatus, default: ApprovalStatus.PENDING })
  status: ApprovalStatus;

  @Column({ name: 'responseNotes', type: 'text', nullable: true })
  responseNotes: string;

  @CreateDateColumn({ name: 'requestedAt' })
  requestedAt: Date;

  @Column({ name: 'respondedAt', nullable: true })
  respondedAt: Date;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}