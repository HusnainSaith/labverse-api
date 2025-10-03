import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDevelopmentPlanTechnologiesTable1753360000018
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'development_plan_technologies',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'plan_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'technology_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'development_plan_technologies',
      new TableForeignKey({
        columnNames: ['plan_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'development_plans',
        onDelete: 'CASCADE',
      }),
    );

    // This assumes 'technologies' table exists and has an 'id' primary key of type UUID
    await queryRunner.createForeignKey(
      'development_plan_technologies',
      new TableForeignKey({
        columnNames: ['technology_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'technologies', // Ensure this table exists and uses UUIDs
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('development_plan_technologies');
    const foreignKeyPlan = table.foreignKeys.find((fk) =>
      fk.columnNames.includes('plan_id'),
    );
    const foreignKeyTechnology = table.foreignKeys.find((fk) =>
      fk.columnNames.includes('technology_id'),
    );

    if (foreignKeyPlan) {
      await queryRunner.dropForeignKey(
        'development_plan_technologies',
        foreignKeyPlan,
      );
    }
    if (foreignKeyTechnology) {
      await queryRunner.dropForeignKey(
        'development_plan_technologies',
        foreignKeyTechnology,
      );
    }

    await queryRunner.dropTable('development_plan_technologies');
  }
}
