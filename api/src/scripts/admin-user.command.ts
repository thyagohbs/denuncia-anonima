import { NestFactory } from '@nestjs/core';
import { Command, CommandRunner, Option } from 'nest-commander';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';

interface CreateAdminCommandOptions {
  email: string;
  password: string;
}

@Command({
  name: 'create-admin',
  description: 'Criar um usuário administrador',
})
export class CreateAdminCommand extends CommandRunner {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async run(
    passedParams: string[],
    options?: CreateAdminCommandOptions,
  ): Promise<void> {
    try {
      if (!options?.email || !options?.password) {
        console.error('Email e senha são obrigatórios');
        return;
      }

      const user = await this.authService.createAdmin({
        email: options.email,
        password: options.password,
      });

      console.log(`Administrador criado com sucesso: ${user.email}`);
    } catch (error) {
      console.error('Erro ao criar administrador:', error.message);
    }
  }

  @Option({
    flags: '-e, --email [email]',
    description: 'Email do administrador',
  })
  parseEmail(val: string): string {
    return val;
  }

  @Option({
    flags: '-p, --password [password]',
    description: 'Senha do administrador',
  })
  parsePassword(val: string): string {
    return val;
  }
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    await app.select(AppModule).get(CreateAdminCommand).run([], {
      email: 'admin@example.com',
      password: 'admin123',
    });
  } catch (error) {
    console.error(error);
  } finally {
    await app.close();
  }
}

// Para executar diretamente via node:
// node -e "require('./dist/admin-user.command').bootstrap()"
