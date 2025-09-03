import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateBlogCommentsTable1753360000028 implements MigrationInterface {
  name = 'CreateBlogCommentsTable1753360000028';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'blog_comments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
             default: 'gen_random_uuid()'
          },
          {
            name: 'post_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true, // SET NULL on delete, if user is deleted
          },
          {
            name: 'guest_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'guest_email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'comment_content',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'parent_comment_id',
            type: 'uuid',
            isNullable: true, // For nested comments
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

    // Add foreign key for post_id
    await queryRunner.createForeignKey(
      'blog_comments',
      new TableForeignKey({
        columnNames: ['post_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'blog_posts',
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign key for user_id (if comments can be by logged-in users)
    await queryRunner.createForeignKey(
      'blog_comments',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'employee_profiles', // Or 'users' table if clients/guests can also be users
        onDelete: 'SET NULL',
      }),
    );

    // Add foreign key for parent_comment_id (self-referencing)
    await queryRunner.createForeignKey(
      'blog_comments',
      new TableForeignKey({
        columnNames: ['parent_comment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'blog_comments',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('blog_comments');
    const foreignKeyPost = table.foreignKeys.find(fk => fk.columnNames.indexOf('post_id') !== -1);
    const foreignKeyUser = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
    const foreignKeyParent = table.foreignKeys.find(fk => fk.columnNames.indexOf('parent_comment_id') !== -1);

    if (foreignKeyPost) await queryRunner.dropForeignKey('blog_comments', foreignKeyPost);
    if (foreignKeyUser) await queryRunner.dropForeignKey('blog_comments', foreignKeyUser);
    if (foreignKeyParent) await queryRunner.dropForeignKey('blog_comments', foreignKeyParent);

    await queryRunner.dropTable('blog_comments');
  }
}
