import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      roles: ['user'],
    });
    await this.usersRepository.save(user);

    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } }) || undefined;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return user;
  }

  async addRole(userId: number, role: string): Promise<User> {
    const user = await this.findById(userId);

    if (!user.roles.includes(role)) {
      user.roles.push(role);
      await this.usersRepository.save(user);
    }

    return user;
  }

  async removeRole(userId: number, role: string): Promise<User> {
    const user = await this.findById(userId);

    user.roles = user.roles.filter((r) => r !== role);
    await this.usersRepository.save(user);

    return user;
  }
}
