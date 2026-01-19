import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) { }
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authservice.login(loginDto.email, loginDto.password);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authservice.register(registerDto);
  }
}
