import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Auth } from './decorators/auth.decorator';
import { ValidRole } from './interfaces/auth.interface';
import { GetUser } from './decorators/get-user.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-user')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

 
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('confirm-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  confirmEmail(@Query('token') token: string ) {
    return this.authService.confirmEmail(token);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(requestPasswordResetDto);
  }

  @Post('update-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(
    @Query('token') token: string,
    @Body() updatedPasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.resetPassword(token, updatedPasswordDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
  @GetUser('id') userId: number
  ) {
   return this.authService.checkAuthStatus(userId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  @Auth(ValidRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Request() req: any) {
    console.log('AJA', req)
    // return this.authService.remove(+id);
  }

}
