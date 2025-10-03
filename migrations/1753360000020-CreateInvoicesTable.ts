import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateInvoicesTable1753360000020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'invoices',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'client_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'project_id',
            type: 'uuid',
            isNullable: true, // Invoice might be independent of a specific project
          },
          {
            name: 'quotation_id',
            type: 'uuid',
            isNullable: true, // Link to a quotation if generated from one
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            isNullable: false,
            default: "'unpaid'", // Default value for status
          },
          {
            name: 'issue_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'due_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'total_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'paid_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
            default: 0.0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Foreign key for client_id
    await queryRunner.createForeignKey(
      'invoices',
      new TableForeignKey({
        columnNames: ['client_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'clients',
        onDelete: 'CASCADE',
      }),
    );

    // Foreign key for project_id
    await queryRunner.createForeignKey(
      'invoices',
      new TableForeignKey({
        columnNames: ['project_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'projects', // Assumes 'projects' table exists from Milestone 2
        onDelete: 'SET NULL', // If project is deleted, don't delete the invoice
      }),
    );

    // Foreign key for quotation_id
    await queryRunner.createForeignKey(
      'invoices',
      new TableForeignKey({
        columnNames: ['quotation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'client_plan_quotations',
        onDelete: 'SET NULL', // If quotation is deleted, don't delete the invoice
      }),
    );

    // Add CHECK constraint with safe enum values
    await queryRunner.query(
      `ALTER TABLE invoices ADD CONSTRAINT chk_invoice_status CHECK (status IN ('unpaid', 'partially_paid', 'paid', 'overdue'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('invoices');
    const foreignKeyClient = table.foreignKeys.find((fk) =>
      fk.columnNames.includes('client_id'),
    );
    const foreignKeyProject = table.foreignKeys.find((fk) =>
      fk.columnNames.includes('project_id'),
    );
    const foreignKeyQuotation = table.foreignKeys.find((fk) =>
      fk.columnNames.includes('quotation_id'),
    );

    if (foreignKeyClient) {
      await queryRunner.dropForeignKey('invoices', foreignKeyClient);
    }
    if (foreignKeyProject) {
      await queryRunner.dropForeignKey('invoices', foreignKeyProject);
    }
    if (foreignKeyQuotation) {
      await queryRunner.dropForeignKey('invoices', foreignKeyQuotation);
    }

    // Drop CHECK constraint
    await queryRunner.query(
      `ALTER TABLE invoices DROP CONSTRAINT IF EXISTS chk_invoice_status`,
    );

    await queryRunner.dropTable('invoices');
  }
}
