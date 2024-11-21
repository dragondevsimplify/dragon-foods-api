import { Module } from '@nestjs/common';
import { CategoriesService } from '@production/categories/categories.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { CategoriesRepository } from '@production/categories/categories.repository';
import { CategoriesController } from '@production/categories/categories.controller';

@Module({
  imports: [PrismaModule],
  providers: [CategoriesService, CategoriesRepository],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
