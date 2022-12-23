import {
  CreationSource,
  UserStatus,
} from '../../src/users/entities/users.entity';

export class UserFixture {
  id: string;
  username: string;
  email: string;
  password: string;
  registerSource: CreationSource;
  status: UserStatus;
  tasks: unknown[];
  updatedAt: Date;
  createdAt: Date;
}

export const sampleUser = (props: Partial<UserFixture>): UserFixture => {
  const defaults: UserFixture = {
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

  return { ...defaults, ...props };
};
