import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTestimonialsTable1753360000031 implements MigrationInterface {
  name = 'CreateTestimonialsTable1753360000031';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'testimonials',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'quote_content',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'author_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'author_title_company',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'author_avatar_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'is_approved',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('testimonials');
  }
}