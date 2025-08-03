import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateClientInteractionsTable1753360000025 implements MigrationInterface {
  name = 'CreateClientInteractionsTable1753360000025';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'client_interactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'client_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'interaction_type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'interaction_date',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'interacted_by',
            type: 'uuid',
            isNullable: true, // SET NULL on delete
          },
          {
            name: 'summary',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    // Add foreign key for client_id
    await queryRunner.createForeignKey(
      'client_interactions',
      new TableForeignKey({
        columnNames: ['client_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'clients',
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign key for interacted_by
    await queryRunner.createForeignKey(
      'client_interactions',
      new TableForeignKey({
        columnNames: ['interacted_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'employee_profiles',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('client_interactions');
    const foreignKeyClient = table.foreignKeys.find(fk => fk.columnNames.indexOf('client_id') !== -1);
    const foreignKeyInteractedBy = table.foreignKeys.find(fk => fk.columnNames.indexOf('interacted_by') !== -1);

    if (foreignKeyClient) await queryRunner.dropForeignKey('client_interactions', foreignKeyClient);
    if (foreignKeyInteractedBy) await queryRunner.dropForeignKey('client_interactions', foreignKeyInteractedBy);

    await queryRunner.dropTable('client_interactions');
  }
}