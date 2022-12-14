import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { User, UsersService } from './users.service';
import {
  CreateUserDto,
  Options,
  UpdateUserDto,
} from '../shared/entities/user.entities';
import e from 'express';
jest.mock;

describe('UsersService', () => {
  let userService: UsersService;

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

  describe('findOneUser', () => {
    let findOneUserSpy: jest.SpyInstance;
    let logMock: jest.SpyInstance;
    beforeEach(() => {
      findOneUserSpy = jest.spyOn(userService, 'findOneUser');
      logMock = jest.spyOn(Logger.prototype, 'log');
    });

    afterEach(() => {
      findOneUserSpy.mockClear();
    });

    it('should call findOneUser with expected param and return user ', () => {
      const user1: User = {
        id: '1',
        username: 'username-2',
        password: 'pass2',
        email: 'email2@gmail.com',
        tasks: [],
      };

      const options: Options = { id: '1', username: 'username-2' };
      const foundUser = userService.findOneUser(options);

      // Function Called (which is obvious but s till added)
      expect(findOneUserSpy).toHaveBeenCalledWith(options);

      // Logging
      expect(logMock).toBeCalledWith(
        'Fetching user based on properties provided.',
        { ...options },
      );
      expect(logMock).toBeCalledWith('User fetched', {
        ...user1,
      });

      expect(logMock).toHaveBeenCalledTimes(2);

      // Expected Output
      expect(foundUser).toEqual(user1);
    });

    it('should return null if no search option provided', () => {
      const options = new Options();
      const userFound = userService.findOneUser(options);

      // Again, Obvious
      expect(findOneUserSpy).toHaveBeenCalledWith(options);

      // Logging
      expect(logMock).toHaveBeenCalledWith(
        'No option provided for finding user.',
      );

      // TODO: Fix Log received, - "RootTestModule dependencies initialized".
      // TODO: Fix test time. One test file taks almost 8 seconds.

      // Expected Output
      expect(userFound).toBeNull();
    });

    it("should return null if user isn't found", () => {
      const options: Options = { id: '5' };
      const userFound = userService.findOneUser(options);

      // Again, Obvious
      expect(findOneUserSpy).toHaveBeenCalledWith(options);

      // Logging
      expect(logMock).toHaveBeenCalledWith(
        'Fetching user based on properties provided.',
        { ...options },
      );

      expect(logMock).toHaveBeenCalledWith('Did not find user');

      // Expected Output
      expect(userFound).toBeNull();
    });
  });

  describe('createUser', () => {
    let findOneUserSpy: jest.SpyInstance;
    let createUserSpy: jest.SpyInstance;
    let logMock: jest.SpyInstance;

    beforeEach(() => {
      findOneUserSpy = jest.spyOn(userService, 'findOneUser');
      createUserSpy = jest.spyOn(userService, 'createUser');
      logMock = jest.spyOn(Logger.prototype, 'log');
    });

    afterEach(() => {
      findOneUserSpy.mockClear();
      createUserSpy.mockClear();
    });

    it('should return null if createUserDto is empty', () => {
      const emptyCreateUserDto = new CreateUserDto();
      const user = userService.createUser(emptyCreateUserDto);

      expect(createUserSpy).toBeCalledWith(emptyCreateUserDto);
      expect(findOneUserSpy).not.toBeCalled();
      expect(logMock).lastCalledWith('Information lacking to create User');
      expect(user).toBeNull();
    });

    it('should return null if one of the properties is not provided', () => {
      const partialCreateUserDto: CreateUserDto = {
        username: 'something',
        password: 'somethingpass',
        email: '',
      };

      const user = userService.createUser(partialCreateUserDto);

      expect(createUserSpy).toBeCalledWith(partialCreateUserDto);
      expect(findOneUserSpy).not.toBeCalled();
      expect(logMock).lastCalledWith('Information lacking to create User');
      expect(user).toBeNull();
    });

    it('should return new user if user not found', () => {
      const createUserDto: CreateUserDto = {
        username: 'something',
        password: 'somethingpass',
        email: 'something@zsomething.com',
      };

      const options: Options = {
        username: createUserDto.username,
        email: createUserDto.email,
      };

      const user = userService.createUser(createUserDto);

      expect(createUserSpy).toBeCalledWith(createUserDto);
      expect(findOneUserSpy).toBeCalledWith(options);

      // Logging
      expect(logMock).toHaveBeenCalledWith(
        'Checking if a user with similar credentials exists',
        { ...options },
      );

      expect(logMock).toHaveBeenCalledWith('User created', {
        email: createUserDto.email,
        username: createUserDto.username,
      });

      expect(user).toEqual({
        id: '3',
        username: 'something',
        password: 'somethingpass',
        email: 'something@zsomething.com',
        tasks: [],
      });
    });

    it('should not return new user if user is found', () => {
      const createUserDto: CreateUserDto = {
        username: 'something',
        password: 'somethingpass',
        email: 'something@zsomething.com',
      };

      const options: Options = {
        username: createUserDto.username,
        email: createUserDto.email,
      };

      const sameValues = {
        email: true,
        username: true,
        userCreated: false,
      };

      const user = userService.createUser(createUserDto);

      expect(createUserSpy).toBeCalledWith(createUserDto);
      expect(findOneUserSpy).toBeCalledWith(options);

      // Logging
      expect(logMock).toHaveBeenCalledWith(
        'Checking if a user with similar credentials exists',
        { ...options },
      );

      expect(logMock).toHaveBeenCalledWith(
        'User with same credentials exists.',
      );

      expect(logMock).toHaveBeenCalledWith(
        'User is already registered with this email',
      );

      expect(logMock).toHaveBeenCalledWith('User already has this username');

      expect(user).toEqual(sameValues);
    });

    it('should return values that match if a user is found with email but username not found', () => {
      const createUserDto: CreateUserDto = {
        username: 'username-231',
        password: 'pass1234',
        email: 'email@gmail.com',
      };

      const options: Options = {
        username: createUserDto.username,
        email: createUserDto.email,
      };

      const sameValues = {
        userCreated: false,
        email: true,
      };

      const user = userService.createUser(createUserDto);

      expect(createUserSpy).toBeCalledWith(createUserDto);
      expect(findOneUserSpy).toBeCalledWith(options);

      // Logging
      expect(logMock).toHaveBeenCalledWith(
        'User with same credentials exists.',
      );

      expect(logMock).toHaveBeenCalledWith(
        'User is already registered with this email',
      );

      expect(logMock).not.toHaveBeenCalledWith(
        'User already has this username',
      );

      expect(user).toEqual(sameValues);
    });

    it('should return all matching properties if user with same email and username is found', () => {
      const createUserDto: CreateUserDto = {
        username: 'username-1',
        password: 'pass1234',
        email: 'email@gmail.com',
      };

      const options: Options = {
        username: createUserDto.username,
        email: createUserDto.email,
      };

      const sameValues = {
        userCreated: false,
        username: true,
        email: true,
      };

      const user = userService.createUser(createUserDto);

      expect(createUserSpy).toBeCalledWith(createUserDto);
      expect(findOneUserSpy).toBeCalledWith(options);

      // Logging
      expect(logMock).toHaveBeenCalledWith(
        'User with same credentials exists.',
      );

      expect(logMock).toHaveBeenCalledWith(
        'User is already registered with this email',
      );

      expect(logMock).toHaveBeenCalledWith('User already has this username');

      expect(user).toEqual(sameValues);
    });
  });

  describe('updateUser', () => {
    let findOneUserSpy: jest.SpyInstance;
    let updateUserSpy: jest.SpyInstance;
    let logMock: jest.SpyInstance;

    beforeEach(() => {
      findOneUserSpy = jest.spyOn(userService, 'updateUser');
      updateUserSpy = jest.spyOn(userService, 'updateUser');
      logMock = jest.spyOn(Logger.prototype, 'log');
    });

    afterEach(() => {
      findOneUserSpy.mockClear();
      updateUserSpy.mockClear();
    });

    it('should return null if updateUserDto does not have id', () => {
      const updateUserDto: UpdateUserDto = {
        id: null,
        username: 'fsdfsp32',
        email: 'fsdfs',
      };

      const updatedUser = userService.updateUser(updateUserDto);

      expect(updateUserSpy).toHaveBeenCalledWith(updateUserDto);
      expect(logMock).lastCalledWith(
        'Cannot update user - id missing or user info empty',
        {
          id: null,
        },
      );

      expect(updatedUser).toBeNull();
    });

    it('should return null if id is present but other properties are not found', () => {
      const updateUserDto: UpdateUserDto = {
        id: '1',
      };

      const updatedUser = userService.updateUser(updateUserDto);

      expect(updateUserSpy).toHaveBeenCalledWith(updateUserDto);
      expect(logMock).lastCalledWith(
        'Cannot update user - id missing or user info empty',
        {
          id: updateUserDto.id,
        },
      );

      expect(updatedUser).toBeNull();
    });

    // TODO: Fix this test.
    it('should return null if user is not found', () => {
      const updateUserDto: UpdateUserDto = {
        id: '4321',
        username: 'changeditup',
        password: 'chanedpass',
      };

      const options: Options = {
        id: '4321',
      };

      const updatedUser = userService.updateUser(updateUserDto);

      expect(updateUserSpy).toBeCalledWith(updateUserDto);
      expect(findOneUserSpy).toBeCalledWith(options);

      // Logging
      expect(logMock).not.toBeCalledWith(
        'Cannot update user - id missing or user info empty',
        {
          id: updateUserDto.id,
        },
      );

      expect(logMock).toBeCalledWith(
        'Checking if a user with similar credentials exists',
      );

      expect(logMock).toBeCalledWith('Could not find user.', {
        id: updateUserDto.id,
      });

      expect(updatedUser).toBeNull();
    });

    // TODO: Fix this test.
    it('should update user if found', () => {
      const updateUserDto: UpdateUserDto = {
        id: '2',
        username: 'changeditup',
        password: 'chanedpass',
      };

      const expectedUpdatedUser: User = {
        id: '2',
        username: 'changeditup',
        password: 'chanedpass',
        email: 'email3@gmail.com',
        tasks: [],
      };

      const options: Options = {
        id: '2',
      };

      const updatedUser = userService.updateUser(updateUserDto);

      expect(updateUserSpy).toBeCalledWith(updateUserDto);
      expect(findOneUserSpy).toHaveBeenCalledWith(options);

      // Logging
      expect(logMock).not.toBeCalledWith(
        'Cannot update user - id missing or user info empty',
        {
          id: updateUserDto.id,
        },
      );

      expect(logMock).toBeCalledWith(
        'Checking if a user with similar credentials exists',
      );

      expect(logMock).not.toBeCalledWith('Could not find user.', {
        id: updateUserDto.id,
      });

      expect(logMock).toBeCalledWith('Updated user.', {
        ...updateUserDto,
      });

      expect(updatedUser).toEqual(expectedUpdatedUser);
    });
  });
});
