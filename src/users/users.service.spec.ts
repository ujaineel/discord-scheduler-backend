import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { User, UsersService } from './users.service';
import { Options } from '../shared/entities/user-entities';
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
});
