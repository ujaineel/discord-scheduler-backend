import { faker } from '@faker-js/faker';
import { CreationSource, UserStatus } from '../../users/entities/users.entity';
import { v4 } from 'uuid';
import { UserFixture as User } from 'test/fixtures/user.fixtures';

// To change when tasks entity is created.
const createRandomTasks = (): unknown[] => {
  // Length of Array
  const randomNumber = Math.round(Math.random() * 5);
  const tasksArray = Array(randomNumber);

  for (let i = 0; i < randomNumber; i++) {
    tasksArray[i] = v4();
  }

  return tasksArray;
};

export const createRandomUser = (): User => {
  return {
    id: faker.datatype.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    registerSource: faker.helpers.arrayElement(Object.values(CreationSource)),
    status: faker.helpers.arrayElement(Object.values(UserStatus)),
    tasks: createRandomTasks(),
    updatedAt: faker.date.between(
      '2022-06-02T00:00:00.000Z',
      '2022-12-22T00:00:00.000Z',
    ),
    createdAt: faker.date.between(
      '2022-01-01T00:00:00.000Z',
      '2030-06-01T00:00:00.000Z',
    ),
  };
};
