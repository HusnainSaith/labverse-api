import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateClientNotesTable1753360000024 implements MigrationInterface {
  name = 'CreateClientNotesTable1753360000024';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'client_notes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()'
          },
          {
            name: 'client_id',
            type: 'uuid', // Assuming 'clients' table uses UUIDs
            isNullable: false,
          },
          {
            name: 'author_id',
            type: 'uuid', // Assuming 'employee_profiles' table uses UUIDs
            isNullable: true, // SET NULL on delete
          },
          {
            name: 'note_content',
            type: 'text',
            isNullable: false,
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
      'client_notes',
      new TableForeignKey({
        columnNames: ['client_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'clients', // Assumes a 'clients' table exists
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign key for author_id
    await queryRunner.createForeignKey(
      'client_notes',
      new TableForeignKey({
        columnNames: ['author_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'employee_profiles', // Assumes 'employee_profiles' table exists
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('client_notes');
    const foreignKeyClient = table.foreignKeys.find(fk => fk.columnNames.indexOf('client_id') !== -1);
    const foreignKeyAuthor = table.foreignKeys.find(fk => fk.columnNames.indexOf('author_id') !== -1);

    if (foreignKeyClient) await queryRunner.dropForeignKey('client_notes', foreignKeyClient);
    if (foreignKeyAuthor) await queryRunner.dropForeignKey('client_notes', foreignKeyAuthor);
    
    await queryRunner.dropTable('client_notes');
  }
}
