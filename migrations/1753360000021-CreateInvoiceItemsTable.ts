import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateInvoiceItemsTable1753360000021 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'invoice_items',
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
                        name: 'description',
                        type: 'text',
                        isNullable: true, // Can be null if service_id is present and description is derived
                    },
                    {
                        name: 'service_id',
                        type: 'uuid',
                        isNullable: true, // Item can be a service or a custom line item
                    },
                    {
                        name: 'quantity',
                        type: 'int',
                        isNullable: false,
                        default: 1,
                    },
                    {
                        name: 'unit_price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: 'total_price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                ],
            }),
            true,
        );

        // Foreign key for invoice_id
        await queryRunner.createForeignKey(
            'invoice_items',
            new TableForeignKey({
                columnNames: ['invoice_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'invoices',
                onDelete: 'CASCADE',
            }),
        );

        // Foreign key for service_id (optional, as an item can be custom)
        await queryRunner.createForeignKey(
            'invoice_items',
            new TableForeignKey({
                columnNames: ['service_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'services',
                onDelete: 'SET NULL',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('invoice_items');
        const foreignKeyInvoice = table.foreignKeys.find(fk => fk.columnNames.includes('invoice_id'));
        const foreignKeyService = table.foreignKeys.find(fk => fk.columnNames.includes('service_id'));

        if (foreignKeyInvoice) {
            await queryRunner.dropForeignKey('invoice_items', foreignKeyInvoice);
        }
        if (foreignKeyService) {
            await queryRunner.dropForeignKey('invoice_items', foreignKeyService);
        }

        await queryRunner.dropTable('invoice_items');
    }
}