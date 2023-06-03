import { Request, Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '登录' })
  @ApiResponse({ status: 201, description: '登陆成功' })
  @ApiBody({
    type: LoginDto,
  })
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: '注册' })
  @ApiResponse({ status: 201, description: '注册成功' })
  @Post('auth/register')
  async register(
    @Body()
    body: RegisterDto,
  ) {
    return this.authService.register(body);
  }

  @ApiOperation({ summary: '发送邮箱验证码' })
  @ApiResponse({ status: 201, description: '发送成功' })
  @Post('auth/sendEmailCode')
  async sendEmailCode(@Body() body: { email: string }) {
    return this.authService.sendEmailCode(body.email);
  }
}
