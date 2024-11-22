import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ResponseCode } from '@/enums/response.enum';
import { Response } from '@/types/response/response.type';
import { plainToClass } from 'class-transformer';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { FileDto } from './dtos/file.dto';

@Controller('media')
export class MediaController {
  constructor() {}

  @Post('uploadImage')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads/',
        filename: (req, file, cb) => {
          const filename = `${uuidv4()}.${file.originalname.split('.').at(-1)}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Response> {
    try {
      const result = {
        url: `http://localhost:3000/uploads/${file.filename}`,
      };

      return {
        code: ResponseCode.OK,
        message: 'Signup successfully',
        data: result ? plainToClass(FileDto, result) : null,
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
