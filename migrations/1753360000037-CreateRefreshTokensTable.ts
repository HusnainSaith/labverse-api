import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRefreshTokensTable1753360000037
  implements MigrationInterface
{
  name = 'CreateRefreshTokensTable1753360000037';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        token VARCHAR NOT NULL,
        user_id UUID NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_revoked BOOLEAN DEFAULT FALSE,
        CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_refresh_tokens_token;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_refresh_tokens_user_id;`);
    await queryRunner.query(`DROP TABLE IF EXISTS refresh_tokens;`);
  }
}
