import { Logger, Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  Options,
  UpdateUserDto,
} from '../shared/entities/user-entities';

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

  findOneUser(options: Options): User | null {
    if (!Object.keys(options).length) {
      this.logger.log('No option provided for finding user.');
      return null;
    }
    this.logger.log('Fetching user based on properties provided.', {
      ...options,
    });
    const user = users.find(
      (user) =>
        user.id === options.id ||
        user.username === options.username ||
        user.email === options.email,
    );
    if (user) {
      this.logger.log('User fetched', { ...user });
      return user;
    }

    this.logger.log('Did not find user');
    return null;
  }

  findAllUsers() {
    this.logger.log('Fetching all users.');
    if (!users) {
      this.logger.log('No user to fetch');
    }
    return users;
  }

  createUser(createUserDto: CreateUserDto) {
    const options: Options = {
      username: createUserDto.username,
      email: createUserDto.email,
    };
    this.logger.log('Checking if a user with similar credentials exists', {
      ...options,
    });

    const user = this.findOneUser(options);
    let sameValues = {};

    // If an user with either same username or email exists.
    if (user) {
      this.logger.log('User with same credentials exists.');
      if (user.email === options.email) {
        this.logger.log('User is already registered with this email');
        sameValues = { email: true };
      }

      if (user.username === options.username) {
        this.logger.log('User already has this username');
        sameValues = { username: true, ...sameValues };
      }

      return { userCreated: false, ...sameValues };
    }

    this.logger.log('User created', {
      email: createUserDto.email,
      username: createUserDto.username,
    });
    users.push({ id: users.length.toString(), tasks: [], ...createUserDto });

    return users[users.length - 1];
  }

  updateUser(updateUserDto: UpdateUserDto) {
    const options: Options = {
      id: updateUserDto.id,
      username: updateUserDto.username,
      email: updateUserDto.email,
    };
    this.logger.log('Checking if a user with similar credentials exists');

    const userFound = this.findOneUser(options);

    if (!userFound) {
      this.logger.log('Could not find user.', { ...options });
      return null;
    }

    const index = users.findIndex((user) => user.id === userFound.id);
    users[index] = { ...updateUserDto, ...userFound };

    this.logger.log('Updated user.', { ...updateUserDto });
    console.log(users[index]);
    return users[index];
  }

  removeUser(id: string) {
    const user = this.findOneUser({ id });

    if (!user) {
      this.logger.log('No user found to delete.');
      return null;
    }

    const userIndex = users.findIndex((user) => user.id === id);

    users.splice(userIndex, 1);

    this.logger.log('User delete.', { id });

    return id;
  }
}
