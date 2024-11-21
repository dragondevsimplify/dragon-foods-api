import { Controller, Post, Body, Param, Session, Put } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { SigninDto } from './dtos/signin.dto';
import { AuthService } from '@system/auth/auth.service';
import { ResponseCode } from '@/enums/response.enum';
import { Response } from '@/types/response/response.type';
import { plainToClass } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersSrv: UsersService,
    private readonly authSrv: AuthService,
  ) {}

  // Đăng ký
  @Post('signup')
  async signup(@Body() payload: CreateUserDto): Promise<Response> {
    try {
      const result = await this.usersSrv.create(payload);

      return {
        code: ResponseCode.OK,
        message: 'Signup successfully',
        data: result ? plainToClass(UserDto, result) : null,
      };
    } catch (err) {
      return {
        code: ResponseCode.FAILED,
        message: err.message,
        data: null,
      };
    }
  }

  // Đăng nhập
  @Post('signin')
  async signin(@Body() payload: SigninDto): Promise<Response> {
    try {
      const result = await this.authSrv.signin(payload);

      return {
        code: ResponseCode.OK,
        message: 'Signin successfully',
        data: result ? plainToClass(UserDto, result) : null,
      };
    } catch (err) {
      return {
        code: ResponseCode.FAILED,
        message: err.message,
        data: null,
      };
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: UpdateUserDto,
  ): Promise<Response> {
    try {
      const result = await this.usersSrv.update(+id, data);
      return {
        code: ResponseCode.OK,
        message: 'Updated successfully',
        data: result ? plainToClass(UserDto, result) : null,
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
