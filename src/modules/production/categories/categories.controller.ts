import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseBoolPipe,
  ParseIntPipe, Patch,
  Post,
  Put,
  Query
} from "@nestjs/common";
import { Response } from '@/types/response/response.type';
import { ResponseCode } from '@/enums/response.enum';
import { CategoriesService } from '@production/categories/categories.service';
import { CreateCategoryDto } from '@production/categories/dtos/create-category.dto';
import { UpdateCategoryDto } from '@production/categories/dtos/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesSrv: CategoriesService) {}

  @Post()
  async create(@Body() data: CreateCategoryDto): Promise<Response> {
    try {
      const result = await this.categoriesSrv.create(data);
      return {
        code: ResponseCode.OK,
        message: 'Created successfully',
        data: result,
      };
    } catch (err) {
      return {
        code: ResponseCode.FAILED,
        message: err.message,
        data: null,
      };
    }
  }

  @Get()
  async findMany(
    @Query(
      'getAll',
      new ParseBoolPipe({
        errorHttpStatusCode: 400,
        exceptionFactory: (err: string) => {
          throw new HttpException(`${err}: getAll`, HttpStatus.BAD_REQUEST);
        },
        optional: true,
      }),
    )
    getAll: boolean = false,
    @Query(
      'pageNumber',
      new ParseIntPipe({
        errorHttpStatusCode: 400,
        exceptionFactory: (err: string) => {
          throw new HttpException(`${err}: pageNumber`, HttpStatus.BAD_REQUEST);
        },
        optional: true,
      }),
    )
    pageNumber: number = 1,
    @Query(
      'pageSize',
      new ParseIntPipe({
        errorHttpStatusCode: 400,
        exceptionFactory: (err: string) => {
          throw new HttpException(`${err}: pageSize`, HttpStatus.BAD_REQUEST);
        },
        optional: true,
      }),
    )
    pageSize: number = 10,
    @Query(
      'sort',
      new ParseArrayPipe({
        items: String,
        separator: ',',
        errorHttpStatusCode: 400,
        exceptionFactory: (err: string) => {
          throw new HttpException(`${err}: sort`, HttpStatus.BAD_REQUEST);
        },
        optional: true,
      }),
    )
    sort: string[] = [],
    @Query('name') name: string = '',
  ): Promise<Response> {
    try {
      const result = await this.categoriesSrv.findMany({
        getAll: !!getAll,
        pageNumber: +pageNumber,
        pageSize: +pageSize,
        sort,
        name,
      });
      return {
        code: ResponseCode.OK,
        message: 'Found',
        data: result,
      };
    } catch (err) {
      return {
        code: ResponseCode.FAILED,
        message: err.message,
        data: null,
      };
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Response> {
    try {
      const result = await this.categoriesSrv.findOne('id', id);
      return {
        code: ResponseCode.OK,
        message: 'Found',
        data: result,
      };
    } catch (err) {
      return {
        code: ResponseCode.FAILED,
        message: err.message,
        data: null,
      };
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateCategoryDto,
  ): Promise<Response> {
    try {
      const result = await this.categoriesSrv.update(id, data);
      return {
        code: ResponseCode.OK,
        message: 'Updated successfully',
        data: result,
      };
    } catch (err) {
      return {
        code: ResponseCode.FAILED,
        message: err.message,
        data: null,
      };
    }
  }
}
