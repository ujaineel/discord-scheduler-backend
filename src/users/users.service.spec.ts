import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  Options,
  UpdateUserDto,
} from '../shared/entities/user-entities';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { CreationSource, User, UserStatus } from './entities/users.entity';
import { EntityRepository } from '@mikro-orm/core/entity';
import { sampleUser } from '../../test/fixtures/user.fixtures';

const findOneMockImplementation = (options: Options) => {
  const userFixture = sampleUser({});
  if (
    // id = '1', email: 'user1@email.com', username: 'username-1'
    options.id === userFixture.id ||
    options.email === userFixture.email ||
    options.username === userFixture.username
  ) {
    return sampleUser({});
  } else {
    return null;
  }
};

describe('UsersService', () => {
  let userService: UsersService;
  let userRepositoryMock: EntityRepository<User>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useFactory: jest.fn(() => ({
            findOne: jest.fn((options) => findOneMockImplementation(options)),
            create: jest.fn((createUserDto) => {
              return sampleUser(createUserDto);
            }),
            persistAndFlush: jest.fn(),
            nativeUpdate: jest.fn(),
            flush: jest.fn(),
            removeAndFlush: jest.fn(),
          })),
        },
        UsersService,
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepositoryMock = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepositoryMock).toBeDefined();
  });

  describe('findOneUser', () => {
    let logMock: jest.SpyInstance;
    let findOneMock: jest.SpyInstance;

    beforeEach(() => {
      logMock = jest.spyOn(Logger.prototype, 'log');
      findOneMock = jest.spyOn(userRepositoryMock, 'findOne');
    });

    afterEach(() => {
      findOneMock.mockClear();
    });

    it('should call findOneUser with expected param and return user ', async () => {
      const user = sampleUser({});

      const findOptions: Options = { id: '1', username: 'username-1' };
      const foundUser = await userService.findOneUser(findOptions);

      // Function Called (which is obvious but s till added)
      expect(findOneMock).toHaveBeenCalledWith(findOptions);
      expect(findOneMock).toBeCalledTimes(1);

      // Logging
      expect(logMock).toHaveBeenCalledWith(
        'Fetching user based on properties provided.',
        { ...findOptions },
      );

      expect(logMock).toHaveBeenCalledWith('User fetched', { ...user });

      expect(logMock).toHaveBeenCalledTimes(2);

      // Expected Output */
      expect(foundUser).toEqual(user);
    });

    it('should return null if no search option provided', async () => {
      const options = new Options();
      const userFound = await userService.findOneUser(options);

      // Again, Obvious
      expect(findOneMock).not.toBeCalled();

      // Logging
      expect(logMock).toHaveBeenCalledWith(
        'No option provided for finding user.',
      );

      expect(logMock).toHaveBeenLastCalledWith(
        'No option provided for finding user.',
      );

      // Expected Output
      expect(userFound).toBeNull();
    });

    it("should return null if user isn't found", async () => {
      const options: Options = { id: '5' };
      const userFound = await userService.findOneUser(options);

      // Again, Obvious
      expect(findOneMock).toHaveBeenCalledWith(options);

      // Logging
      expect(logMock).toHaveBeenCalledWith(
        'Fetching user based on properties provided.',
        { ...options },
      );

      expect(logMock).toHaveBeenLastCalledWith('Did not find user');

      // Expected Output
      expect(userFound).toBeNull();
    });
  });

  describe('createUser', () => {
    let findOneMock: jest.SpyInstance;
    let createMock: jest.SpyInstance;
    let persistAndFlushMock: jest.SpyInstance;
    let createUserMock: jest.SpyInstance;
    let logMock: jest.SpyInstance;

    beforeEach(() => {
      findOneMock = jest.spyOn(userRepositoryMock, 'findOne');
      createMock = jest.spyOn(userRepositoryMock, 'create');
      persistAndFlushMock = jest.spyOn(userRepositoryMock, 'persistAndFlush');
      createUserMock = jest.spyOn(userService, 'createUser');
      logMock = jest.spyOn(Logger.prototype, 'log');
    });

    afterEach(() => {
      findOneMock.mockClear();
      createMock.mockClear();
      persistAndFlushMock.mockClear();
      createUserMock.mockClear();
    });

    it('should return null if createUserDto is empty', async () => {
      const emptyCreateUserDto = new CreateUserDto();
      const user = await userService.createUser(emptyCreateUserDto);

      expect(createUserMock).toBeCalledWith(emptyCreateUserDto);

      // Function ends before DB calls are triggerred.
      expect(findOneMock).not.toBeCalled();
      expect(createMock).not.toBeCalled();
      expect(persistAndFlushMock).not.toBeCalled();

      expect(logMock).lastCalledWith('Information lacking to create User');
      expect(user).toBeNull();
    });

    it('should return null if one of the properties is not provided', async () => {
      const partialCreateUserDto: CreateUserDto = {
        username: 'something',
        password: 'somethingpass',
        email: '',
      };

      const user = await userService.createUser(partialCreateUserDto);

      expect(createUserMock).toBeCalledWith(partialCreateUserDto);

      expect(findOneMock).not.toBeCalled();
      expect(createMock).not.toBeCalled();
      expect(persistAndFlushMock).not.toBeCalled();

      expect(logMock).lastCalledWith('Information lacking to create User');
      expect(user).toBeNull();
    });

    it('should return new user if user not found', async () => {
      const createUserDto: CreateUserDto = {
        username: 'something',
        password: 'somethingpass',
        email: 'something@zsomething.com',
      };

      const options: Options = {
        username: createUserDto.username,
        email: createUserDto.email,
      };

      const user = await userService.createUser(createUserDto);

      expect(createUserMock).toBeCalledWith(createUserDto);

      expect(findOneMock).toBeCalledWith(options);
      expect(createMock).toBeCalledWith(createUserDto);
      expect(persistAndFlushMock).toBeCalled();

      // Logging
      expect(logMock).toHaveBeenCalledWith(
        'Checking if a user with similar credentials exists',
        { ...options },
      );

      expect(logMock).toHaveBeenCalledWith('User created', {
        email: createUserDto.email,
        username: createUserDto.username,
      });

      expect(user).toEqual(sampleUser(createUserDto));
    });

    it('should not return new user if username is found', async () => {
      const createUserDto: CreateUserDto = {
        username: 'username-1',
        password: 'dsfsdfsdf',
        email: 'something@zsomething.com',
      };

      const options: Options = {
        username: createUserDto.username,
        email: createUserDto.email,
      };

      const sameValues = {
        username: true,
        userCreated: false,
      };

      const user = await userService.createUser(createUserDto);

      expect(createUserMock).toBeCalledWith(createUserDto);
      expect(findOneMock).toBeCalledWith(options);
      expect(createMock).not.toBeCalled();
      expect(persistAndFlushMock).not.toBeCalled();

      // Logging
      expect(logMock).toHaveBeenCalledWith(
        'Checking if a user with similar credentials exists',
        { ...options },
      );

      expect(logMock).toHaveBeenCalledWith(
        'User with same credentials exists.',
      );

      expect(logMock).not.toHaveBeenCalledWith(
        'User is already registered with this email',
      );

      expect(logMock).toHaveBeenCalledWith('User already has this username');

      expect(user).toEqual(sameValues);
    });

    it('should not return new user if email is found', async () => {
      const createUserDto: CreateUserDto = {
        username: 'username',
        password: 'dsfsdfsdf',
        email: 'username1@email.com',
      };

      const options: Options = {
        username: createUserDto.username,
        email: createUserDto.email,
      };

      const sameValues = {
        email: true,
        userCreated: false,
      };

      const user = await userService.createUser(createUserDto);

      expect(createUserMock).toBeCalledWith(createUserDto);
      expect(findOneMock).toBeCalledWith(options);

      expect(createMock).not.toBeCalled();
      expect(persistAndFlushMock).not.toBeCalled();

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

      expect(logMock).not.toHaveBeenCalledWith(
        'User already has this username',
      );

      expect(user).toEqual(sameValues);
    });

    it('should return all matching properties if email and username is found', async () => {
      const createUserDto: CreateUserDto = {
        username: 'username-1',
        password: 'pass1234',
        email: 'username1@email.com',
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

      const user = await userService.createUser(createUserDto);

      expect(createUserMock).toBeCalledWith(createUserDto);
      expect(findOneMock).toBeCalledWith(options);

      expect(createMock).not.toBeCalled();
      expect(persistAndFlushMock).not.toBeCalled();

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

    it('should throw an error if findOneUser throws an error', async () => {
      const createUserDto: CreateUserDto = {
        username: 'username-1',
        password: 'pass1234',
        email: 'username1@email.com',
      };

      const findOneUserMock = jest
        .spyOn(userService, 'findOneUser')
        .mockImplementation(() => {
          throw new Error('Something wrong with findOneUser');
        });

      try {
        await userService.createUser(createUserDto);
      } catch (err) {
        expect(err).toMatchObject({
          message: 'Something wrong with findOneUser',
        });
      }

      findOneUserMock.mockClear();
    });
  });

  describe('updateUser', () => {
    let findOneMock: jest.SpyInstance;
    let nativeUpdateSpy: jest.SpyInstance;
    let flushSpy: jest.SpyInstance;
    let updateUserSpy: jest.SpyInstance;
    let logMock: jest.SpyInstance;

    beforeEach(() => {
      findOneMock = jest.spyOn(userRepositoryMock, 'findOne');
      nativeUpdateSpy = jest.spyOn(userRepositoryMock, 'nativeUpdate');
      flushSpy = jest.spyOn(userRepositoryMock, 'flush');
      updateUserSpy = jest.spyOn(userService, 'updateUser');
      logMock = jest.spyOn(Logger.prototype, 'log');
    });

    afterEach(() => {
      findOneMock.mockClear();
      nativeUpdateSpy.mockClear();
      flushSpy.mockClear();
      updateUserSpy.mockClear();
    });

    it('should return null if updateUserDto does not have id', async () => {
      const updateUserDto: UpdateUserDto = {
        id: null,
        username: 'fsdfsp32',
        email: 'fsdfs',
      };

      const updatedUser = await userService.updateUser(updateUserDto);

      expect(updateUserSpy).toHaveBeenCalledWith(updateUserDto);

      expect(logMock).lastCalledWith(
        'Cannot update user - id missing or user info empty',
        {
          id: null,
        },
      );

      expect(nativeUpdateSpy).not.toBeCalled();
      expect(flushSpy).not.toBeCalled();

      expect(updatedUser).toBeNull();
    });

    it('should return null if id is present but other properties are not found', async () => {
      const updateUserDto: UpdateUserDto = {
        id: '1',
      };

      const updatedUser = await userService.updateUser(updateUserDto);

      expect(updateUserSpy).toHaveBeenCalledWith(updateUserDto);
      expect(logMock).lastCalledWith(
        'Cannot update user - id missing or user info empty',
        {
          id: updateUserDto.id,
        },
      );

      expect(nativeUpdateSpy).not.toBeCalled();
      expect(flushSpy).not.toBeCalled();

      expect(updatedUser).toBeNull();
    });

    it('should return null if user is not found', async () => {
      const updateUserDto: UpdateUserDto = {
        id: '4321',
        username: 'changeditup',
        password: 'chanedpass',
      };

      const updatedUser = await userService.updateUser(updateUserDto);

      expect(updateUserSpy).toBeCalledWith(updateUserDto);
      expect(findOneMock).toBeCalled();

      expect(nativeUpdateSpy).not.toBeCalled();
      expect(flushSpy).not.toBeCalled();

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
    it('should update user if found', async () => {
      const updateUserDto: UpdateUserDto = {
        id: '1',
        username: 'changeditup',
        password: 'chanedpass',
      };

      const { id, ...rest } = updateUserDto;

      const options: Options = {
        id: id,
      };

      await userService.updateUser(updateUserDto);

      expect(updateUserSpy).toBeCalledWith(updateUserDto);
      expect(findOneMock).toBeCalledWith(options);
      expect(findOneMock).toBeCalledTimes(2);

      expect(nativeUpdateSpy).toBeCalled();
      expect(flushSpy).toBeCalled();

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
        ...rest,
      });
    });
  });

  describe('removeUser', () => {
    let findOneUserSpy: jest.SpyInstance;
    let removeFlushSpy: jest.SpyInstance;
    let removeUserSpy: jest.SpyInstance;
    let logMock: jest.SpyInstance;

    beforeEach(() => {
      findOneUserSpy = jest.spyOn(userService, 'findOneUser');
      removeFlushSpy = jest.spyOn(userRepositoryMock, 'removeAndFlush');
      removeUserSpy = jest.spyOn(userService, 'removeUser');
      logMock = jest.spyOn(Logger.prototype, 'log');
    });

    afterEach(() => {
      findOneUserSpy.mockClear();
      removeFlushSpy.mockClear();
      removeUserSpy.mockClear();
    });

    it('should return null if user not found', async () => {
      const id = null;

      const user = await userService.removeUser(id);

      expect(removeUserSpy).toBeCalledWith(id);
      expect(findOneUserSpy).toBeCalledWith({ id });
      expect(removeFlushSpy).not.toBeCalled();
      // Logging
      expect(logMock).toHaveBeenLastCalledWith('No user found to delete.');

      expect(user).toBeNull();
    });

    it('should return user if user found and deleted.', async () => {
      const id = '1';

      const expectedUser = {
        id: '1',
        username: 'username-1',
        email: 'username1@email.com',
        password: 'pass1',
        registerSource: CreationSource.LOCAL,
        status: UserStatus.ACTIVE,
        tasks: ['task1', 'task2'],
        updatedAt: new Date('2022-06-08T00:00:00.000Z'),
        createdAt: new Date('2022-06-02T00:00:00.000Z'),
      };

      const user = await userService.removeUser(id);

      expect(removeUserSpy).toBeCalledWith(id);
      expect(findOneUserSpy).toBeCalledWith({ id });
      expect(removeFlushSpy).toBeCalledWith(expectedUser);

      expect(user).toEqual(expectedUser);

      // Logging
      expect(logMock).not.toHaveBeenLastCalledWith('No user found to delete.');
      expect(logMock).toHaveBeenLastCalledWith('User deleted.', {
        id,
        username: expectedUser.username,
      });
    });
  });
});
