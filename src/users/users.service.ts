import { Logger, Injectable } from '@nestjs/common';
import { CreateUserDto, Options } from 'src/shared/entities/user-entities';

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
    id: '2',
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
    const user = users.find(
      (user) =>
        user.id === options.id ||
        user.username === options.username ||
        user.email === options.email,
    );
    if (user) {
      this.logger.log({ user }, 'User fetched');
      return user;
    }

    this.logger.warn('Did not find user');
    return null;
  }

  findAll() {
    this.logger.log('Fetching all users.');
    if (!users) {
      this.logger.log('No user to fetch');
    }
    return users;
  }

  create(createUserDto: CreateUserDto) {
    const options: Options = {
      username: createUserDto.username,
      email: createUserDto.email,
    };
    this.logger.log('Checking if a user with similar credentials exists');

    const user = this.findOne(options);
    let sameValues = {};

    // If an user with either same username or email exists.
    if (user) {
      this.logger.log('User with same credentials exists.');
      if (user.email === options.email) {
        this.logger.warn('User is already registered with this email');
        sameValues = { email: true };
      }

      if (user.username === options.username) {
        this.logger.warn('User already has this username');
        sameValues = { username: true, ...sameValues };
      }

      return { userCreated: false, ...sameValues };
    }

    this.logger.log(
      { email: createUserDto.email, username: createUserDto.username },
      'User created',
    );
    users.push({ id: users.length.toString(), tasks: [], ...createUserDto });

    return null;
  }

  update() {}

  remove() {}
}
