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
