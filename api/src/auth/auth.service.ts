import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateAdmin(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.roles.includes('admin')) {
        throw new UnauthorizedException(
          'Acesso negado: usuário não é administrador',
        );
      }
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: any) {
    const payload = { email: user.email, sub: user.id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  register(registerDto: RegisterDto) {
    return this.usersService.create(registerDto);
  }

  // Método para criar um administrador (apenas para uso em desenvolvimento/testes)
  async createAdmin(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    await this.usersService.addRole(user.id, 'admin');
    return user;
  }
}
