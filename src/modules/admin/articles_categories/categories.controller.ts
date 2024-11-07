import { Body, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AdminController } from 'src/common/utils/controllers';
import { CreateCategoryDto } from './dto/create.dto';
import { CategoriesService } from './categories.service';

@AdminController('articles/categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  create(@Body() body: CreateCategoryDto) {
    return this.categoriesService.createCategory(body);
  }

  @Patch(':id')
  update(@Body() body: CreateCategoryDto, @Param('id') id: number) {
    return this.categoriesService.updateCategory(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.categoriesService.deleteCategory(id);
  }
}
