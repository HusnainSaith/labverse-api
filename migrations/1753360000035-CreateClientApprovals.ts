import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClientApprovals1753360000035 implements MigrationInterface {
  name = 'CreateClientApprovals1753360000035';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create custom ENUM type for approval status
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approval_status_enum') THEN
          CREATE TYPE approval_status_enum AS ENUM ('pending', 'approved', 'rejected');
        END IF;
      END $$;
    `);

    // Create the 'client_approvals' table
    await queryRunner.query(`
      CREATE TABLE client_approvals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "clientId" VARCHAR NOT NULL,
        "deliverableId" VARCHAR NOT NULL,
        "requestDetails" TEXT NOT NULL,
        status approval_status_enum DEFAULT 'pending',
        "responseNotes" TEXT,
        "requestedAt" TIMESTAMP DEFAULT now(),
        "respondedAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop table and type
    await queryRunner.query(`DROP TABLE IF EXISTS client_approvals`);
    await queryRunner.query(`DROP TYPE IF EXISTS approval_status_enum`);
  }
}