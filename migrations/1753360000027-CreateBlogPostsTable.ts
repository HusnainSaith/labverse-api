import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateBlogPostsTable1753360000027 implements MigrationInterface {
  name = 'CreateBlogPostsTable1753360000027';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'blog_posts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
             default: 'gen_random_uuid()'
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
            name: 'content',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'author_id',
            type: 'uuid',
            isNullable: true, // SET NULL on delete
          },
          {
            name: 'category_id',
            type: 'uuid',
            isNullable: true, // SET NULL on delete
          },
          {
            name: 'thumbnail_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'is_published',
            type: 'boolean',
            default: false,
          },
          {
            name: 'published_at',
            type: 'timestamp',
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

    // Add foreign key for author_id
    await queryRunner.createForeignKey(
      'blog_posts',
      new TableForeignKey({
        columnNames: ['author_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'employee_profiles',
        onDelete: 'SET NULL',
      }),
    );

    // Add foreign key for category_id
    await queryRunner.createForeignKey(
      'blog_posts',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('blog_posts');
    const foreignKeyAuthor = table.foreignKeys.find(fk => fk.columnNames.indexOf('author_id') !== -1);
    const foreignKeyCategory = table.foreignKeys.find(fk => fk.columnNames.indexOf('category_id') !== -1);

    if (foreignKeyAuthor) await queryRunner.dropForeignKey('blog_posts', foreignKeyAuthor);
    if (foreignKeyCategory) await queryRunner.dropForeignKey('blog_posts', foreignKeyCategory);

    await queryRunner.dropTable('blog_posts');
  }
}
