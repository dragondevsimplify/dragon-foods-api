import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { BaseRepository } from '@/core/base.repository';
import { PageInfo } from '@/types/request/page-info.type';
import { QueryMetadata } from '@/types/request/query-metadata.type';
import { User } from './users.type';
import { PaginationResponse } from '@/types/response/response.type';

@Injectable()
export class UsersRepository extends BaseRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, 'sys_users' /* table name */);
  }

  async findMany(pageInfo: PageInfo & User): Promise<PaginationResponse> {
    const queryMetadata: QueryMetadata = {
      where: {
        username: {},
        email: {},
      },
    };
    if (pageInfo.username) {
      queryMetadata.where.username.contains = pageInfo.username;
    }
    if (pageInfo.email) {
      queryMetadata.where.email.contains = pageInfo.email;
    }

    return await super.findMany(pageInfo, queryMetadata);
  }
}
