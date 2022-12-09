import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { User, UsersService } from './users.service';
import { Options } from '../shared/entities/user-entities';
import { ModuleRef } from '@nestjs/core';

describe('UsersService', () => {
  let userService: UsersService;
  const logger: Logger = new Logger(UsersService.name);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should call findOneUser with expected param and return user ', () => {
    const findOneUserSpy = jest.spyOn(userService, 'findOneUser');
    const logSpy = jest.spyOn(logger, 'log');

    const user1: User = {
      id: '1',
      username: 'username-2',
      password: 'pass2',
      email: 'email2@gmail.com',
      tasks: [],
    };

    const options: Options = { id: '1', username: 'username-2' };
    const foundUser = userService.findOneUser(options);

    expect(findOneUserSpy).toHaveBeenCalledWith(options);
    expect(logSpy).toHaveBeenCalledTimes(2);

    expect(foundUser).toEqual(user1);

    // Logging
  });
});
