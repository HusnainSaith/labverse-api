import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreatePaymentsTable1753360000022 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'payments',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'invoice_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: 'payment_date',
                        type: 'date',
                        isNullable: false,
                        default: 'CURRENT_DATE',
                    },
                    {
                        name: 'payment_method',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'transaction_reference',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                        isUnique: true, // Assuming transaction references should be unique
                    },
                    {
                        name: 'notes',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Foreign key for invoice_id
        await queryRunner.createForeignKey(
            'payments',
            new TableForeignKey({
                columnNames: ['invoice_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'invoices',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('payments');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.includes('invoice_id'));

        if (foreignKey) {
            await queryRunner.dropForeignKey('payments', foreignKey);
        }

        await queryRunner.dropTable('payments');
    }
}