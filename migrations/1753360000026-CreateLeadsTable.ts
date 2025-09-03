import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateLeadsTable1753360000026 implements MigrationInterface {
  name = 'CreateLeadsTable1753360000026';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'leads',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
             default: 'gen_random_uuid()'
          },
          {
            name: 'company_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'contact_person_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'phone_number',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            default: `'New'`, // Use single quotes for string default values in SQL
            isNullable: false,
          },
          {
            name: 'assigned_to',
            type: 'uuid',
            isNullable: true, // SET NULL on delete
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

    // Add foreign key for assigned_to
    await queryRunner.createForeignKey(
      'leads',
      new TableForeignKey({
        columnNames: ['assigned_to'],
        referencedColumnNames: ['id'],
        referencedTableName: 'employee_profiles',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('leads');
    const foreignKeyAssignedTo = table.foreignKeys.find(fk => fk.columnNames.indexOf('assigned_to') !== -1);

    if (foreignKeyAssignedTo) await queryRunner.dropForeignKey('leads', foreignKeyAssignedTo);

    await queryRunner.dropTable('leads');
  }
}
