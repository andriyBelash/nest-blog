import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { ArticleStatus } from '../common/types/enum'; // Переконайтеся, що шлях до enum правильний

export class CreateArticleTable1728207621648 implements MigrationInterface {
  name = 'CreateArticleTable1728207621648';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'articles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'slug',
            type: 'varchar',
          },
          {
            name: 'badge',
            type: 'varchar',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'status',
            type: 'enum',
            enum: [ArticleStatus.PUBLISHED, ArticleStatus.DRAFT],
            default: `'${ArticleStatus.PUBLISHED}'`, // Значення за замовчуванням
          },
          {
            name: 'logo',
            type: 'varchar',
            isNullable: true,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('articles');
  }
}
