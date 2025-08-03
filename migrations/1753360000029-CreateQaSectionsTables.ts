import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateQaSectionsTables1753360000029 implements MigrationInterface {
  name = 'CreateQaSectionsTables1753360000029';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'questions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'question_text',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'asked_by',
            type: 'uuid',
            isNullable: true, // SET NULL on delete
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

    await queryRunner.createTable(
      new Table({
        name: 'answers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'question_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'answer_text',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'answered_by',
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

    // Add foreign keys for 'questions' table
    await queryRunner.createForeignKey(
      'questions',
      new TableForeignKey({
        columnNames: ['asked_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'employee_profiles',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'questions',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
      }),
    );

    // Add foreign keys for 'answers' table
    await queryRunner.createForeignKey(
      'answers',
      new TableForeignKey({
        columnNames: ['question_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'questions',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'answers',
      new TableForeignKey({
        columnNames: ['answered_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'employee_profiles',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const answersTable = await queryRunner.getTable('answers');
    const answersFkQuestion = answersTable.foreignKeys.find(fk => fk.columnNames.indexOf('question_id') !== -1);
    const answersFkAnsweredBy = answersTable.foreignKeys.find(fk => fk.columnNames.indexOf('answered_by') !== -1);
    
    if (answersFkQuestion) await queryRunner.dropForeignKey('answers', answersFkQuestion);
    if (answersFkAnsweredBy) await queryRunner.dropForeignKey('answers', answersFkAnsweredBy);
    await queryRunner.dropTable('answers');

    const questionsTable = await queryRunner.getTable('questions');
    const questionsFkAskedBy = questionsTable.foreignKeys.find(fk => fk.columnNames.indexOf('asked_by') !== -1);
    const questionsFkCategory = questionsTable.foreignKeys.find(fk => fk.columnNames.indexOf('category_id') !== -1);

    if (questionsFkAskedBy) await queryRunner.dropForeignKey('questions', questionsFkAskedBy);
    if (questionsFkCategory) await queryRunner.dropForeignKey('questions', questionsFkCategory);
    await queryRunner.dropTable('questions');
  }
}