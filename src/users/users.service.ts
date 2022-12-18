import { Logger, Injectable } from '@nestjs/common';
import { isEmpty } from '../shared/helpers/user.helpers';
import {
  CreateUserDto,
  Options,
  UpdateUserDto,
} from '../shared/entities/user.entities';
import { EntityRepository } from '@mikro-orm/core';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: EntityRepository<User>) {}
  private readonly logger = new Logger(UsersService.name);

  findOneUser(options: Options): User | null {
    if (!Object.keys(options).length) {
      this.logger.log('No option provided for finding user.');
      return null;
    }
    this.logger.log('Fetching user based on properties provided.', {
      ...options,
    });

    let user;
    try {
      user = this.userRepository.findOne({ ...options });
    } catch (err) {
      this.logger.error(err);
      return null;
    }

    if (user) {
      this.logger.log('User fetched', { ...user });
      return user;
    }

    this.logger.log('Did not find user');
    return null;
  }

  /* istanbul ignore next */
  findAllUsers() {
    this.logger.log('Fetching all users.');
    let users;
    try {
      users = this.userRepository.findAll();
    } catch (err) {
      this.logger.error(err);
      return null;
    }
    if (!users) {
      this.logger.log('No user to fetch');
    }
    return users;
  }

  createUser(createUserDto: CreateUserDto) {
    // TODO: Create helper function to check if all values are there.
    if (isEmpty(createUserDto)) {
      this.logger.log('Information lacking to create User');
      return null;
    }

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

    let newUser;
    try {
      this.userRepository.persistAndFlush({ ...createUserDto });
      newUser = this.userRepository.findOne({ ...options });
    } catch (err) {
      this.logger.error(err);
      return null;
    }

    this.logger.log('User created', {
      email: createUserDto.email,
      username: createUserDto.username,
    });

    return newUser;
  }

  updateUser(updateUserDto: UpdateUserDto) {
    const { id, ...rest } = updateUserDto;
    if (!updateUserDto.id || isEmpty(rest)) {
      this.logger.log('Cannot update user - id missing or user info empty', {
        id,
      });
      return null;
    }

    const options: Options = {
      id,
    };

    this.logger.log('Checking if a user with similar credentials exists');
    const userFound = this.findOneUser(options);

    if (!userFound) {
      this.logger.log('Could not find user.', { ...options });
      return null;
    }

    let updatedUser;
    try {
      this.userRepository.nativeUpdate({ ...options }, { ...rest });
      this.userRepository.flush();
      updatedUser = this.userRepository.findOne({ ...options });
    } catch (err) {
      this.logger.error(err);
      return null;
    }

    // TODO: Remove password from log tags.
    this.logger.log('Updated user.', { ...rest });

    return updatedUser;
  }

  removeUser(id: string) {
    const user = this.findOneUser({ id });

    if (!user) {
      this.logger.log('No user found to delete.');
      return null;
    }

    try {
      this.userRepository.removeAndFlush({ id });
    } catch (err) {
      this.logger.error(err);
      return null;
    }

    this.logger.log('User deleted.', { id, username: user.username });

    return user;
  }
}
