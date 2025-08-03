import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateFileStorageTable1753400000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'file_storage',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'filename',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'original_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'mimetype',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'size',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['document', 'image', 'video', 'audio', 'other'],
            default: "'other'",
          },
          {
            name: 'provider',
            type: 'enum',
            enum: ['aws_s3', 'google_cloud', 'local'],
            default: "'local'",
          },
          {
            name: 'storage_path',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'public_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'entity_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'entity_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'uploaded_by',
            type: 'uuid',
            isNullable: false,
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
          },
        ],
        foreignKeys: [
          {
            columnNames: ['uploaded_by'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createIndex('file_storage', new TableIndex({
      columnNames: ['entity_type', 'entity_id']
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('file_storage');
  }
}