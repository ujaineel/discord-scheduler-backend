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
      username: 'user1',
      password: 'pass1',
      email: 'user1@gmail.com',
    };
    const user = this.usersService.createUser(userData);
    if (!user) {
      this.logger.warn('User Not Created.');
    }
    this.logger.log('Created User.', { ...user });

    this.logger.log('Update User');

    const updateUserDto: UpdateUserDto = {
      id: '378bf4c3-ddd2-4192-9957-0be04daaf442',
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
