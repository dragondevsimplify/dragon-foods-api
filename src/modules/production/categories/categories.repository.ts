import { BaseRepository } from '@/core/base.repository';
import { PrismaService } from '@/prisma/prisma.service';
import { PageInfo } from '@/types/request/page-info.type';
import { Injectable } from '@nestjs/common';
import { Category } from './categories.type';
import { QueryMetadata } from '@/types/request/query-metadata.type';
import { PaginationResponse } from '@/types/response/response.type';

@Injectable()
export class CategoriesRepository extends BaseRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, 'prod_categories' /* table name */);
  }

  async findMany(pageInfo: PageInfo & Category): Promise<PaginationResponse> {
    const queryMetadata: QueryMetadata = {
      where: {},
    };

    if (pageInfo.name) {
      queryMetadata.where.name = {
        contains: pageInfo.name,
        mode: 'insensitive',
      };
    }

    return await super.findMany(pageInfo, queryMetadata);
  }
}
