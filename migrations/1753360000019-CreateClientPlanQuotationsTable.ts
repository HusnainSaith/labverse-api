import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateClientPlanQuotationsTable1753360000019 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'client_plan_quotations',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'client_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'plan_id',
                        type: 'uuid',
                        isNullable: true, // Can be null if it's a custom quotation
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                        default: "'draft'", // Default value for status
                    },
                    {
                        name: 'discount_percent',
                        type: 'decimal',
                        precision: 5,
                        scale: 2,
                        isNullable: false,
                        default: 0.00,
                    },
                    {
                        name: 'notes',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'total_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: true, // Can be calculated later
                    },
                    {
                        name: 'created_by',
                        type: 'uuid',
                        isNullable: true, // Might be system generated initially
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Add foreign key for client_id (assuming 'clients' table exists with UUID id)
        await queryRunner.createForeignKey(
            'client_plan_quotations',
            new TableForeignKey({
                columnNames: ['client_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'clients', // OR 'users' table if clients are just users
                onDelete: 'CASCADE', // If client is deleted, delete their quotations
            }),
        );

        // Add foreign key for plan_id
        await queryRunner.createForeignKey(
            'client_plan_quotations',
            new TableForeignKey({
                columnNames: ['plan_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'development_plans',
                onDelete: 'SET NULL', // If a plan is deleted, don't delete quotations that used it
            }),
        );

        // Add foreign key for created_by (assuming 'users' table exists with UUID id)
        await queryRunner.createForeignKey(
            'client_plan_quotations',
            new TableForeignKey({
                columnNames: ['created_by'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL', // If user is deleted, don't delete quotations
            }),
        );

        // Optional: Add CHECK constraint if your database requires it at schema level
        // await queryRunner.query(
        //     `ALTER TABLE client_plan_quotations ADD CONSTRAINT chk_quotation_status CHECK (status IN ('draft', 'sent', 'accepted', 'rejected'))`
        // );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('client_plan_quotations');
        const foreignKeyClient = table.foreignKeys.find(fk => fk.columnNames.includes('client_id'));
        const foreignKeyPlan = table.foreignKeys.find(fk => fk.columnNames.includes('plan_id'));
        const foreignKeyCreatedBy = table.foreignKeys.find(fk => fk.columnNames.includes('created_by'));

        if (foreignKeyClient) {
            await queryRunner.dropForeignKey('client_plan_quotations', foreignKeyClient);
        }
        if (foreignKeyPlan) {
            await queryRunner.dropForeignKey('client_plan_quotations', foreignKeyPlan);
        }
        if (foreignKeyCreatedBy) {
            await queryRunner.dropForeignKey('client_plan_quotations', foreignKeyCreatedBy);
        }

        // If you added a CHECK constraint with raw SQL, you might drop it here
        // await queryRunner.query(`ALTER TABLE client_plan_quotations DROP CONSTRAINT IF EXISTS chk_quotation_status`);

        await queryRunner.dropTable('client_plan_quotations');
    }
}