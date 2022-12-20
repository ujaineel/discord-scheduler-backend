import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto, UpdateUserDto } from './shared/entities/user-entities';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /* istanbul ignore next */
  @Get('meta')
  meta(): string {
    this.logger.log('Create User');

    const userData: CreateUserDto = {
      username: 'user2',
      password: 'pass2',
      email: 'user2@gmail.com',
    };
    const user = this.usersService.createUser(userData);
    if (!user) {
      this.logger.warn('User Not Created.');
    }
    this.logger.log('Created User.', { ...user });

    this.logger.log('Update User');

    const updateUserDto: UpdateUserDto = {
      id: '0f00f8b7-e327-405b-bb76-266a9738e4b4',
      username: 'updatedUser3',
      email: 'updatedUser3@email.com',
    };

    const updatedUser = this.usersService.updateUser(updateUserDto);
    this.logger.log('Updated User', { ...updatedUser });

    this.logger.log('Remove User');
    const id = 'f245b5ce-0437-4c4e-a2c6-d9883933b077';
    const removedUser = this.usersService.removeUser(id);
    this.logger.debug('Removed User', { removedUser });

    return 'meta';
  }
}
