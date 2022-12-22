import { CreationSource, UserStatus } from 'src/users/entities/users.entity';

export class Options {
  id?: string;
  username?: string;
  email?: string;
}

export class CreateUserDto {
  username: string;
  password: string;
  email: string;
  registerSource?: CreationSource;
  status?: UserStatus;
}

export class UpdateUserDto {
  id: string;
  username?: string;
  password?: string;
  email?: string;
  // To update in future.
  tasks?: unknown[];
}
