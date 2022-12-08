export interface Options {
  id?: string;
  username?: string;
  email?: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
  email: string;
}

export interface UpdateUserDto {
  id: string;
  username?: string;
  password?: string;
  email?: string;
  // To update in future.
  tasks?: Array<unknown>;
}
