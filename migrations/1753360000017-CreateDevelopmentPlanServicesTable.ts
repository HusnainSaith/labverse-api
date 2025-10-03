import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDevelopmentPlanServicesTable1753360000017
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'development_plan_services',
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
            name: 'service_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'development_plan_services',
      new TableForeignKey({
        columnNames: ['plan_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'development_plans',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'development_plan_services',
      new TableForeignKey({
        columnNames: ['service_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'services',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('development_plan_services');
    const foreignKeyPlan = table.foreignKeys.find((fk) =>
      fk.columnNames.includes('plan_id'),
    );
    const foreignKeyService = table.foreignKeys.find((fk) =>
      fk.columnNames.includes('service_id'),
    );

    if (foreignKeyPlan) {
      await queryRunner.dropForeignKey(
        'development_plan_services',
        foreignKeyPlan,
      );
    }
    if (foreignKeyService) {
      await queryRunner.dropForeignKey(
        'development_plan_services',
        foreignKeyService,
      );
    }

    await queryRunner.dropTable('development_plan_services');
  }
}
