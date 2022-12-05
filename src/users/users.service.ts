import { Logger, Injectable } from '@nestjs/common';
import { Options } from 'src/shared/entities/user-entities';

export class User {
  id: string;
  username: string;
  password: string;
  email: string;
  tasks: [];
}

const users: User[] = [
  {
    id: '0',
    username: 'username-1',
    password: 'pass1',
    email: 'email@gmail.com',
    tasks: [],
  },
  {
    id: '1',
    username: 'username-2',
    password: 'pass2',
    email: 'email2@gmail.com',
    tasks: [],
  },
  {
    id: '3',
    username: 'username-3',
    password: 'pass3',
    email: 'email3@gmail.com',
    tasks: [],
  },
];

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  findOne(options: Options): User | null {
    if (!Object.keys(options).length) {
      this.logger.log('No option provided for finding user.');
      return null;
    }
    this.logger.log({ options }, 'Fetching user based on properties provided.');
    const user = users.find((user) => user.id === options.id);
    if (user) {
      this.logger.log({ user }, 'User fetched');
      return user;
    }

    this.logger.error('Did not find user');
    return null;
  }

  findAll() {
    this.logger.log('Fetching all users.');
    if (!users){
      this.logger.log('No user to fetch');
    }
    return users;
  }

  create() {}

  update() {}

  remove() {}
}
