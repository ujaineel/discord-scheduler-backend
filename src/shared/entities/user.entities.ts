export class Options {
  id?: string;
  username?: string;
  email?: string;
}

export class CreateUserDto {
  username: string;
  password: string;
  email: string;
}

export class UpdateUserDto {
  id: string;
  username?: string;
  password?: string;
  email?: string;
  // To update in future.
  tasks?: unknown[];
}
