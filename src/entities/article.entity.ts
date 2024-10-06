import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ArticleStatus } from '../common/types/enum';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  badge: string;

  @Column()
  content: string;

  @Column()
  user_id: number;

  @Column({
    default: () => ArticleStatus.PUBLISHED,
    type: 'enum',
    enum: ArticleStatus,
  })
  status: string;

  @Column({ nullable: true })
  logo: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
