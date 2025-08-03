import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateCaseStudiesTable1753360000030 implements MigrationInterface {
  name = 'CreateCaseStudiesTable1753360000030';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'case_studies',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'introduction',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'challenge',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'solution',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'results',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'client_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'thumbnail_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'category_id',
            type: 'uuid',
            isNullable: true, // SET NULL on delete
          },
          {
            name: 'is_published',
            type: 'boolean',
            default: false,
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

    // Add foreign key for category_id
    await queryRunner.createForeignKey(
      'case_studies',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('case_studies');
    const foreignKeyCategory = table.foreignKeys.find(fk => fk.columnNames.indexOf('category_id') !== -1);

    if (foreignKeyCategory) await queryRunner.dropForeignKey('case_studies', foreignKeyCategory);

    await queryRunner.dropTable('case_studies');
  }
}