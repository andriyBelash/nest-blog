import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/articles_category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  createCategory(body: CreateCategoryDto) {
    const category = this.categoryRepository.create(body);
    return this.categoryRepository.save(category);
  }

  async updateCategory(id: number, body: CreateCategoryDto) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new Error('Категорія не найдена');
    this.categoryRepository.merge(category, body);
    const results = await this.categoryRepository.save(category);
    return results;
  }

  deleteCategory(id: number) {
    const category = this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new Error('Категорія не найдена');
    return this.categoryRepository.delete({ id });
  }

  findAll() {
    return this.categoryRepository.find();
  }
}
