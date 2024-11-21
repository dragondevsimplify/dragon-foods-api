import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoriesRepository } from '@production/categories/categories.repository';
import { BaseService } from '@/core/base.service';
import { CreateCategoryDto } from '@production/categories/dtos/create-category.dto';

@Injectable()
export class CategoriesService extends BaseService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {
    super(categoriesRepo);
  }

  async create(data: any) {
    const _data = data as CreateCategoryDto;

    const existedRecord = await this.categoriesRepo.findOne('name', _data.name);
    if (existedRecord) {
      throw new BadRequestException('Category name already exists');
    }

    return await super.create(data);
  }
}
