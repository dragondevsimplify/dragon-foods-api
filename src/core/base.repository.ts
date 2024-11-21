import { PageInfo } from '@/types/request/page-info.type';
import {
  QueryMetadata,
  QueryWithOrder,
} from '@/types/request/query-metadata.type';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationResponse } from '@/types/response/response.type';
import { ObjectId } from 'mongodb';

const sortValuesOmitted = ['null', 'undefined'];

export class BaseRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly tableName: string,
  ) {}

  private _validateSort(pageInfo: PageInfo) {
    // Get the valid fields for the table
    const validFields = Prisma.dmmf.datamodel.models.find(
      (i) => i.name === this.tableName,
    )?.fields;
    if (!validFields) {
      throw new Error(`Invalid table name: ${this.tableName}`);
    }

    // Check if the sort fields are valid
    pageInfo.sort.forEach((s) => {
      if (sortValuesOmitted.includes(s)) {
        return;
      }

      const [field] = s.split(':');
      if (!validFields.find((f) => f.name === field)) {
        throw new Error(`Invalid field when sort: ${field}`);
      }
    });
  }

  async create(data: any) {
    return await this.prisma[this.tableName].create({ data });
  }

  async findOne(k: string, v: any) {
    return await this.prisma[this.tableName].findFirst({
      where: {
        [k]: v,
      },
    });
  }

  async findMany(
    pageInfo: PageInfo,
    queryMetadata: QueryMetadata = {},
  ): Promise<PaginationResponse> {
    queryMetadata.where.deletedAt = null;

    if (!pageInfo.getAll) {
      if (!pageInfo.pageSize || !pageInfo.pageNumber) {
        throw new Error('pageSize, pageNumber are required');
      }

      queryMetadata.take = pageInfo.pageSize;
      queryMetadata.skip = (pageInfo.pageNumber - 1) * pageInfo.pageSize;
    }

    if (pageInfo.sort?.length) {
      this._validateSort(pageInfo);

      // Set the order by
      queryMetadata.orderBy = pageInfo.sort
        .filter((s) => !sortValuesOmitted.includes(s))
        .map((s) => {
          const [field, order] = s.split(':');

          // Check if the order is valid
          if (
            !Object.values(QueryWithOrder).includes(order as QueryWithOrder)
          ) {
            throw new Error(`Invalid order: ${order}`);
          }

          return {
            [field]: order,
          };
        });
    }

    const [list, totalItems] = await Promise.all([
      this.prisma[this.tableName].findMany(queryMetadata),
      this.prisma[this.tableName].count({
        where: queryMetadata.where,
      }),
    ]);

    const totalPages =
      totalItems && pageInfo.pageSize
        ? Math.ceil(totalItems / pageInfo.pageSize)
        : 0;

    return Promise.resolve({
      list: list ?? [],
      totalPages: totalPages ?? 0,
      totalItems: totalItems ?? 0,
      pageSize: pageInfo.pageSize ?? 0,
      pageNumber: pageInfo.pageNumber ?? 0,
    });
  }

  async update(id: string, data: any) {
    return await this.prisma[this.tableName].update({
      where: { id },
      data,
    });
  }
}
