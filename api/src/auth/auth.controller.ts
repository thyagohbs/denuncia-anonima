import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AdminLoginDto } from './dto/admin-login.dto';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Fazer login' })
  @ApiBody({ type: LoginDto })
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AdminAuthGuard)
  @Post('admin/login')
  @ApiOperation({ summary: 'Fazer login como administrador' })
  @ApiBody({ type: AdminLoginDto })
  adminLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/profile')
  @ApiOperation({ summary: 'Obter perfil do administrador logado' })
  @ApiBearerAuth()
  getAdminProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  @ApiBearerAuth()
  getProfile(@Request() req) {
    return req.user;
  }
}
