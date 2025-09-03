import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateDevelopmentPlanFeaturesTable1753360000016 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'development_plan_features',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                         default: 'gen_random_uuid()'
                    },
                    {
                        name: 'plan_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'feature_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'development_plan_features',
            new TableForeignKey({
                columnNames: ['plan_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'development_plans',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'development_plan_features',
            new TableForeignKey({
                columnNames: ['feature_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'plan_features',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('development_plan_features');
        const foreignKeyPlan = table.foreignKeys.find(fk => fk.columnNames.includes('plan_id'));
        const foreignKeyFeature = table.foreignKeys.find(fk => fk.columnNames.includes('feature_id'));

        if (foreignKeyPlan) {
            await queryRunner.dropForeignKey('development_plan_features', foreignKeyPlan);
        }
        if (foreignKeyFeature) {
            await queryRunner.dropForeignKey('development_plan_features', foreignKeyFeature);
        }

        await queryRunner.dropTable('development_plan_features');
    }
}
